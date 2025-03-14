# Generated by Django 4.2.15 on 2024-09-03 19:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PropertyOwner',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.RemoveField(
            model_name='propertyadminprofile',
            name='user',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='phone_number',
        ),
        migrations.AddField(
            model_name='customuser',
            name='sub',
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='rol',
            field=models.CharField(choices=[('owner', 'Property Owner'), ('investor', 'Investor')], default='owner', max_length=20),
        ),
        migrations.DeleteModel(
            name='DeveloperProfile',
        ),
        migrations.DeleteModel(
            name='PropertyAdminProfile',
        ),
        migrations.AddField(
            model_name='propertyowner',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='property_admin_profile', to=settings.AUTH_USER_MODEL),
        ),
    ]
