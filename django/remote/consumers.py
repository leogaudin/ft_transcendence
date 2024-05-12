import json
import random
import asyncio
import copy

from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from .game import Game
from pongue.models import GameResults, PongueUser, Tournament
from pongue.views import jwt_required, get_user_from_jwt


class RemoteConsumer(AsyncWebsocketConsumer):
	rooms = {}

	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["player_id"]
		self.room_group_name = f"game_{self.room_name}"

		if self.room_group_name in self.rooms and "game" in self.rooms[self.room_group_name]:
			await self.accept()
			await self.close(4001)
			return

		if self.room_group_name not in self.rooms.keys():
			self.rooms[self.room_group_name] = {"players": {"player1": self}}
		else:
			self.rooms[self.room_group_name] = {"players": {"player2": self}}
			self.rooms[self.room_group_name]["game"] = Game(self, 1, 2)
			self.game = self.rooms[self.room_group_name]["game"]
			self.game.socket = self
			self.game.hostId = int(self.room_name)

		# Join Room group
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)

		await self.accept()

	async def disconnect(self, close_code):
		# Leave from Room group
		print("disconnecting")
		# TODO - NOTIFIY PLAYERS THAT CONNECTION HAS BEEN CLOSED !!!
		if (hasattr(self, "game_task") and self.game_task != None):
			self.game_task.cancel()
		del self.game
		if (self.room_group_name in self.rooms):
			self.rooms.pop(self.room_group_name)
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	# Receive data from WebSocket
	async def receive(self, text_data):
		game_info_json = json.loads(text_data)

		if ("buildGame" in game_info_json.keys()):
			if (self.room_group_name in self.rooms.keys()):
				self.game = self.rooms[self.room_group_name]["game"]
			await self.channel_layer.group_send(
				self.room_group_name, {
					"type": "game.info",
					"gameData": True,
					"sender": game_info_json["userId"],
					"ballPosX": self.game.ball.xPos,
					"ballPosY": self.game.ball.yPos,
					"pOnePosX": self.game.pOne.xPos,
					"pOnePosY": self.game.pOne.yPos,
					"pTwoPosX": self.game.pTwo.xPos,
					"pTwoPosY": self.game.pTwo.yPos,
				}
			)
			self.game_task = asyncio.create_task(self.game.runGame())
			return

		if ("playerMovement" in game_info_json.keys()):
			if (game_info_json["userId"] == self.game.hostId):
				if (game_info_json["movementDir"] == 1):
					self.game.pOne.setUpMovement(game_info_json["playerMovement"])
				else:
					self.game.pOne.setDownMovement(game_info_json["playerMovement"])
			else:
				if (game_info_json["movementDir"] == 1):
					self.game.pTwo.setUpMovement(game_info_json["playerMovement"])
				else:
					self.game.pTwo.setDownMovement(game_info_json["playerMovement"])
			await self.channel_layer.group_send(
				self.room_group_name, {
					"type": "game.info",
					"gameData": True,
					"sender": game_info_json["userId"],
					"ballPosX": self.game.ball.xPos,
					"ballPosY": self.game.ball.yPos,
					"pOnePosX": self.game.pOne.xPos,
					"pOnePosY": self.game.pOne.yPos,
					"pTwoPosX": self.game.pTwo.xPos,
					"pTwoPosY": self.game.pTwo.yPos,
				}
			)
			return

		if ("gameReady" in game_info_json.keys()):
			self.rooms[self.room_group_name]["player2Jwt"] = game_info_json["userJwt"]
			self.game = self.rooms[self.room_group_name]["game"]
			ready = game_info_json["gameReady"]
			await self.channel_layer.group_send(
				self.room_group_name, {
					"type": "game.info",
					"data": ready
				}
			)
			return
		
		if ("firstConnection" in game_info_json.keys()):
			self.rooms[self.room_group_name]["player1Jwt"] = game_info_json["userJwt"]
			return


	# Recive data from Room group
	async def game_info(self, event):
		if ("gameData" in event.keys()):
			if (self.room_group_name in self.rooms.keys()):
				self.game = self.rooms[self.room_group_name]["game"]
			await self.send(text_data=json.dumps({
				"gameData": True,
				"ballPosX": self.game.ball.xPos,
				"ballPosY": self.game.ball.yPos,
				"pOnePosX": self.game.pOne.xPos,
				"pOnePosY": self.game.pOne.yPos,
				"pTwoPosX": self.game.pTwo.xPos,
				"pTwoPosY": self.game.pTwo.yPos,
			}))
			return

		if ("data" in event.keys()):
			await self.send(text_data=json.dumps({
				"gameReady": True,
				"gameData": True
			}))
			return

	async def add_point(self, event):
		await self.send(text_data=json.dumps({
			"scoreData": True,
			"pOneScore": self.game.score.pOne,
			"pTwoScore": self.game.score.pTwo
		}))
		return

	async def game_end(self, event):
		await self.send(text_data=json.dumps({
			"gameEnd": event
		}))
		return

class TournamentConsumer(AsyncWebsocketConsumer):
	rooms = {}

	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["player_id"]
		self.room_group_name = f"tournament_{self.room_name}"

		if self.room_group_name in self.rooms and "tournament" in self.rooms[self.room_group_name]:
			await self.accept()
			await self.close(4001)
			return

		if self.room_group_name not in self.rooms.keys():
			self.rooms[self.room_group_name] = {"players": {"player1": -1}}
		elif "player2" not in self.rooms[self.room_group_name]["players"].keys():
			self.rooms[self.room_group_name]["players"]["player2"] = -1
		elif "player3" not in self.rooms[self.room_group_name]["players"].keys():
			self.rooms[self.room_group_name]["players"]["player3"] = -1
		else:
			self.rooms[self.room_group_name]["players"]["player4"] = -1
			self.rooms[self.room_group_name]["tournament"] = True

		# Join Room group
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)

		await self.accept()

	async def disconnect(self):
		# Leave from Room group
		print("disconnecting")
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	# Receive data from WebSocket
	async def receive(self, text_data):
		print(text_data)
		data = json.loads(text_data)
		print(data)

		if ("register" in data.keys()):
			if (self.rooms[self.room_group_name]["players"]["player1"] == -1):
				self.rooms[self.room_group_name]["players"]["player1"] = await sync_to_async(PongueUser.objects.get)(id=data["userId"])
			elif (self.rooms[self.room_group_name]["players"]["player2"] == -1):
				self.rooms[self.room_group_name]["players"]["player2"] = await sync_to_async(PongueUser.objects.get)(id=data["userId"])
			elif (self.rooms[self.room_group_name]["players"]["player3"] == -1):
				self.rooms[self.room_group_name]["players"]["player3"] = await sync_to_async(PongueUser.objects.get)(id=data["userId"])
			elif (self.rooms[self.room_group_name]["players"]["player4"] == -1):
				self.rooms[self.room_group_name]["players"]["player4"] = await sync_to_async(PongueUser.objects.get)(id=data["userId"])
				userP1 = self.rooms[self.room_group_name]["players"]["player1"]
				userP1.status = PongueUser.Status.INTOURNAMENT
				await sync_to_async(userP1.save)()
				userP2 = self.rooms[self.room_group_name]["players"]["player2"]
				userP2.status = PongueUser.Status.INTOURNAMENT
				await sync_to_async(userP2.save)()
				userP3 = self.rooms[self.room_group_name]["players"]["player3"]
				userP3.status = PongueUser.Status.INTOURNAMENT
				await sync_to_async(userP3.save)()
				userP4 = self.rooms[self.room_group_name]["players"]["player4"]
				userP4.status = PongueUser.Status.INTOURNAMENT
				await sync_to_async(userP4.save)()

			await self.channel_layer.group_send(
				self.room_group_name, {
					"type": "new.player",
					"hostId": self.rooms[self.room_group_name]["players"]["player1"].id,
					"userId": data["userId"]
				}
			)
			return
		
	async def new_player(self, event):
		await self.send(text_data=json.dumps({
			"newPlayer": event
		}))
		return
