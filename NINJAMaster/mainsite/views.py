import json

from django.contrib.auth import login, logout
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.db import transaction
from django.db.models import F, Prefetch
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

from .models import (
    Character,
    CharacterImage,
    CharacterVote,
    ElementHolderHistory,
    ElementPower,
    Feedback,
)


def login_page(request):
    next_url = (request.POST.get("next") or request.GET.get("next") or "").strip()
    form = AuthenticationForm(request, data=request.POST or None)

    if request.user.is_authenticated:
        return render(
            request,
            "login.html",
            {
                "form": form,
                "next": next_url,
            },
        )

    if request.method == "POST" and form.is_valid():
        login(request, form.get_user())
        if next_url and url_has_allowed_host_and_scheme(
            url=next_url,
            allowed_hosts={request.get_host()},
            require_https=request.is_secure(),
        ):
            return redirect(next_url)
        return redirect("home")

    return render(
        request,
        "login.html",
        {
            "form": form,
            "next": next_url,
        },
    )


def register_page(request):
    if request.user.is_authenticated:
        return redirect("home")

    next_url = (request.POST.get("next") or request.GET.get("next") or "").strip()
    form = UserCreationForm(request.POST or None)

    if request.method == "POST" and form.is_valid():
        user = form.save()
        login(request, user)
        if next_url and url_has_allowed_host_and_scheme(
            url=next_url,
            allowed_hosts={request.get_host()},
            require_https=request.is_secure(),
        ):
            return redirect(next_url)
        return redirect("home")

    return render(
        request,
        "register.html",
        {
            "form": form,
            "next": next_url,
        },
    )


def logout_page(request):
    if request.method == "POST" and request.user.is_authenticated:
        logout(request)
    return redirect("login")


@ensure_csrf_cookie
def characters_page(request):
    if not request.session.session_key:
        request.session.save()

    session_key = request.session.session_key
    characters = (
        Character.objects.all()
        .prefetch_related(
            Prefetch(
                "images",
                queryset=CharacterImage.objects.order_by("sort_order", "id"),
            )
        )
        .order_by("name")
    )
    voted_character_ids = set(
        CharacterVote.objects.filter(session_key=session_key).values_list("character_id", flat=True)
    )
    return render(
        request,
        "characters.html",
        {
            "characters": characters,
            "voted_character_ids": voted_character_ids,
        },
    )


@require_POST
def character_vote(request, character_id):
    if not request.session.session_key:
        request.session.save()
    session_key = request.session.session_key

    character = get_object_or_404(Character, pk=character_id)

    with transaction.atomic():
        vote, created = CharacterVote.objects.get_or_create(
            character=character,
            session_key=session_key,
        )

        if created:
            Character.objects.filter(pk=character.pk).update(vote_count=F("vote_count") + 1)

    character.refresh_from_db(fields=["vote_count"])

    return JsonResponse(
        {
            "ok": True,
            "already_voted": not created,
            "character_id": character.id,
            "vote_count": character.vote_count,
        }
    )


# ── Contact & Feedback ──────────────────────────────────────────────

# Render the contact page template (GET request)
@ensure_csrf_cookie
def contact_page(request):
    return render(request, "contact.html")


# API endpoint — accept feedback form submissions via POST
@require_POST
def submit_feedback(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "Invalid JSON payload."}, status=400)

    # Extract and validate required fields
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    category = (data.get("category") or "").strip()
    message = (data.get("message") or "").strip()

    errors = {}
    if not name:
        errors["name"] = "Name is required."
    if not email:
        errors["email"] = "Email is required."
    if category not in dict(Feedback.Category.choices):
        errors["category"] = "Please select a valid category."
    if not message:
        errors["message"] = "Feedback message is required."

    if errors:
        return JsonResponse({"ok": False, "errors": errors}, status=400)

    # Save feedback to database
    Feedback.objects.create(
        name=name,
        email=email,
        category=category,
        message=message,
    )

    return JsonResponse({"ok": True, "message": "Thank you for your feedback!"})


def element_powers_api(request):
    powers = (
        ElementPower.objects.select_related("source", "current_holder")
        .prefetch_related(
            Prefetch(
                "holder_history",
                queryset=ElementHolderHistory.objects.select_related("character").order_by(
                    "sort_order",
                    "id",
                ),
            )
        )
        .order_by("source__sort_order", "sort_order", "name")
    )

    payload = []
    for power in powers:
        current_holder = power.current_holder.name if power.current_holder else power.current_holder_name
        current_holder = (current_holder or "").strip()

        history_items = []
        for item in power.holder_history.all():
            holder_name = item.character.name if item.character else item.holder_name
            history_items.append(
                {
                    "character_id": item.character_id,
                    "holder": (holder_name or "").strip(),
                    "start_label": (item.start_label or "").strip(),
                    "end_label": (item.end_label or "").strip(),
                    "is_current": item.is_current,
                    "note": (item.note or "").strip(),
                }
            )

        payload.append(
            {
                "code": power.code,
                "name": power.name,
                "description": (power.description or "").strip(),
                "source_code": power.source.code,
                "source_name": power.source.name,
                "current_holder": current_holder,
                "history": history_items,
            }
        )

    return JsonResponse({"ok": True, "elements": payload})


def character_profile_api(request, character_id):
    character = get_object_or_404(
        Character.objects.prefetch_related(
            Prefetch(
                "images",
                queryset=CharacterImage.objects.order_by("sort_order", "id"),
            )
        ),
        pk=character_id,
    )

    images = [image.image.url for image in character.images.all()]
    return JsonResponse(
        {
            "ok": True,
            "character": {
                "id": character.id,
                "name": character.name,
                "gender": character.get_gender_display(),
                "affiliation": character.affiliation,
                "homeland": character.homeland,
                "occupation": character.occupation,
                "element": character.element,
                "first_appearance": character.first_appearance,
                "description": character.description,
                "images": images,
                "vote_count": character.vote_count,
            },
        }
    )
