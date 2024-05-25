from django.shortcuts import render
from django.http import JsonResponse
from http import HTTPStatus
from pongue.views import jwt_required, get_user_from_jwt
from pongue.models import PongueUser, GameResults
import json

def check_opened_game_room(user):
	"""
		Function that looks for another user in DataBase with
		Status attribute in LGAME (looking for game).

		Parameters:
		user (PongeUser): User that is looking for a remote game.

		Returns:
		PongeUser: Another user's id that is looking for a remote game as well
		or -1 if none is found.
	"""
	users = PongueUser.objects.all()
	for u in users:
		if u.status == PongueUser.Status.LGAME and u.id != user.id:
			u.status = PongueUser.Status.INGAME
			u.save()
			user.status = PongueUser.Status.INGAME
			user.save()
			return u.id
	return -1

def check_opened_tournament():
	users = PongueUser.objects.all()
	for u in users:
		if u.status == PongueUser.Status.HTOURNAMENT:
			return u.id
	return -1


@jwt_required
def find_game(request):
	user = get_user_from_jwt(request)
	user.status = PongueUser.Status.LGAME
	user.save()
	playerId = check_opened_game_room(user)
	if playerId != -1:
		return JsonResponse(status=HTTPStatus.OK, data={
			"debug": "player with ws already opened",
			"roomId": playerId,
			"userId": user.id,
			"fullGame": True
		})
	else:
		return JsonResponse(status=HTTPStatus.OK, data={
			"debug": "needs to open new game_room",
			"roomId": user.id,
			"userId": user.id,
			"fullGame": False
		})

@jwt_required
def cancel_find_game(request):
	user = get_user_from_jwt(request)
	user.status = PongueUser.Status.ONLINE
	user.save()
	return JsonResponse(status=HTTPStatus.OK, data={
		"debug": "game cancelled successfully"
	})

@jwt_required
def register_result(request):
	player_1 = request.POST.get("player_1")
	player_2 = request.POST.get("player_2")
	player_1_score = request.POST.get("player_1_score")
	player_2_score = request.POST.get("player_2_score")
	created_at = request.POST.get("created_at")
	updated_at = request.POST.get("updated_at")

	user1 = PongueUser.objects.get(id=player_1)
	user1.status = PongueUser.Status.ONLINE
	user2 = PongueUser.objects.get(id=player_2)
	user2.status = PongueUser.Status.ONLINE

	if (player_1_score > player_2_score):
		user1.points += 10
		user1.games_won += 1
		user2.games_lost += 1
	else:
		user2.points += 10
		user2.games_won += 1
		user1.games_lost += 1
	user1.games_played += 1
	user2.games_played += 1

	user1.save()
	user2.save()

	game_result = GameResults()
	game_result.player_1 = user1
	game_result.player_2 = user2
	game_result.player_1_score = player_1_score
	game_result.player_2_score = player_2_score
	game_result.created_at = created_at
	game_result.updated_at = updated_at
	game_result.save()

	return JsonResponse(status=HTTPStatus.OK, data={
		"debug": "received"
	})

@jwt_required
def find_tournament(request):
	user = get_user_from_jwt(request)
	user.status = PongueUser.Status.LTOURNAMENT
	user.save()
	playerId = check_opened_tournament()
	if playerId != -1:
		return JsonResponse(status=HTTPStatus.OK, data={
			"debug": "tournament host already assigned",
			"roomId": playerId,
			"userId": user.id
		})
	else:
		user.status = PongueUser.Status.HTOURNAMENT
		user.save()
		return JsonResponse(status=HTTPStatus.OK, data={
			"debug": "needs to host the tournament",
			"roomId": user.id,
			"userId": user.id,
		})

@jwt_required
def register_tournament_win(request):
	user = get_user_from_jwt(request)
	user.points += 100
	user.tournaments += 1
	user.save()
	return JsonResponse(status=HTTPStatus.OK, data={
		"debug": "received"
	})
