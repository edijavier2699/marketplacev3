# Generated by Django 4.2.16 on 2024-11-08 10:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('property', '0028_propertyupdates'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='property',
            options={'ordering': ['-created_at']},
        ),
        migrations.AddField(
            model_name='property',
            name='rejection_reason_comment',
            field=models.TextField(blank=True, help_text='Extra information for the rejection reason', null=True),
        ),
    ]
