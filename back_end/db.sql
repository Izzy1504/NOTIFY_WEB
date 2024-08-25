CREATE TABLE "users" (
	"id" serial primary key,
	"user_name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
	"password" VARCHAR NOT NULL
);


CREATE TABLE "songs" (
	"id" INTEGER NOT NULL UNIQUE,
	"song_name" VARCHAR NOT NULL,
	"singer" VARCHAR NOT NULL,
	"song_url" VARCHAR NOT NULL,
	PRIMARY KEY("id")
);


