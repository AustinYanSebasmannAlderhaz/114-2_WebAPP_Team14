from django.core.management import call_command
from django.test import TestCase

from .models import Character, CharacterImage, ElementPower, ElementSource, Feedback


class InitialContentCommandTests(TestCase):
    def test_seed_initial_content_loads_default_records(self):
        call_command("seed_initial_content", verbosity=0)

        self.assertEqual(Character.objects.count(), 14)
        self.assertEqual(CharacterImage.objects.count(), 42)
        self.assertEqual(ElementSource.objects.count(), 7)
        self.assertEqual(ElementPower.objects.count(), 7)

    def test_reset_content_keeps_feedback_records(self):
        Feedback.objects.create(
            name="Maintainer",
            email="maintainer@example.com",
            category=Feedback.Category.OTHER,
            message="Keep me around.",
        )

        call_command("seed_initial_content", reset_content=True, verbosity=0)

        self.assertEqual(Feedback.objects.count(), 1)


class FeedbackModelTests(TestCase):
    def test_feedback_defaults_to_new_status(self):
        feedback = Feedback.objects.create(
            name="Kai",
            email="kai@example.com",
            category=Feedback.Category.CHARACTERS,
            message="More fire content please.",
        )

        self.assertEqual(feedback.status, Feedback.Status.NEW)
        self.assertEqual(feedback.admin_note, "")
