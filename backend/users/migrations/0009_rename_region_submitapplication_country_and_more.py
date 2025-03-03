# Generated by Django 4.2.16 on 2024-11-13 15:06

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0008_submitapplication'),
    ]

    operations = [
        migrations.RenameField(
            model_name='submitapplication',
            old_name='region',
            new_name='country',
        ),
        migrations.AddField(
            model_name='submitapplication',
            name='reference_number',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
