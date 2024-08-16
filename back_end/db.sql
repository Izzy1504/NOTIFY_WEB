CREATE TABLE "user " (
	"id" INTEGER NOT NULL UNIQUE,
	"user_name" VARCHAR NOT NULL,
	"password" VARCHAR NOT NULL,
	PRIMARY KEY("id")
);


CREATE TABLE "songs" (
	"id" INTEGER NOT NULL UNIQUE,
	"song_name" VARCHAR NOT NULL,
	"singer" VARCHAR NOT NULL,
	"song_url" VARCHAR NOT NULL,
	PRIMARY KEY("id")
);


