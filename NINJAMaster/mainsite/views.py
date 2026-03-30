from django.shortcuts import render
from django.db.models import Prefetch

from .models import Character, CharacterImage


def characters_page(request):
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
    return render(request, "characters.html", {"characters": characters})
