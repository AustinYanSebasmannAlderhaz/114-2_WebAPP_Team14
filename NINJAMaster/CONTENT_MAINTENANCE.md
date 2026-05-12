# Content Maintenance

This project keeps the default site content in a Django fixture:

```bash
python manage.py seed_initial_content
```

Use this after `migrate` when setting up a new database.

To rebuild the content tables from the fixture:

```bash
python manage.py seed_initial_content --reset-content
```

`--reset-content` removes character, element, vote, favorite, and timeline progress records before loading the fixture. Feedback records are kept so visitor messages are not lost.

The fixture lives at:

```text
mainsite/fixtures/initial_content.json
```
