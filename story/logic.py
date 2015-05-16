from django.core.exceptions import ObjectDoesNotExist
from django.forms import model_to_dict
from drealtime import iShoutClient
from story.apps import DefaultSettingsConfig
from story.models import UserSettings, UserProfile

ishout_client = iShoutClient()


def broadcast_message(message):
	ishout_client.broadcast(
		channel='notifications',
		data=message.json
	)


def send_message_to_user(message, user):
	# send to receiver
	message_context = message.json
	message_context['private'] = True
	ishout_client.emit(
		user_id=user,
		channel='notifications',
		data=message_context
	)
	# send to sender if it's not himself
	if user.id != message.sender.id:
		message_context['private'] = user.username
		ishout_client.emit(
			user_id=message.sender,
			channel='notifications',
			data=message_context
		)


def send_user_list():
	room_status = ishout_client.get_room_status('main')
	users = UserProfile.objects.filter(id__in=room_status['members'])
	# list of dictionaries { Monika : Female, Andrew : Male }
	ishout_client.broadcast(
		channel='refresh_users',
		data={user.username: user.sex for user in users}
	)


def get_users(users):
	return {user.id: user.username for user in users}


def get_user_settings(user):
	if user.is_authenticated():
		try:
			return model_to_dict(UserSettings.objects.get(pk=user.id))
		except ObjectDoesNotExist:
			pass
	return DefaultSettingsConfig.colors
