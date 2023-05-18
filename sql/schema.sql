CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    username text UNIQUE
);

CREATE TABLE IF NOT EXISTS upcoming_games (
    id text PRIMARY KEY,
    host uuid REFERENCES public.users(id) ON DELETE CASCADE,
    lobby uuid[],
    locked boolean,
    max_players int2,
    num_mafia int2,
    num_doctor int2,
    num_detective int2,
    num_vigilante int2,
    is_public boolean
);

CREATE TABLE IF NOT EXISTS current_games (
    id text PRIMARY KEY,
    host uuid REFERENCES public.users(id) ON DELETE CASCADE,
    round_num int2,
    is_day boolean,
    players uuid[],
    mafia uuid[],
    doctor uuid[],
    detective uuid[],
    vigilante uuid[],
    alive uuid[],
    nominated uuid[],
    votes uuid[],
    voted boolean[],
    is_public boolean
);

CREATE TABLE IF NOT EXISTS finished_games (
    id text PRIMARY KEY,
    winner boolean,
    players uuid[],
    mafia uuid[],
    doctor uuid[],
    detective uuid[],
    vigilante uuid[],
    alive uuid[],
    is_public boolean
);