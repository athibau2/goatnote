CREATE TABLE "user"
(
  userid SERIAL NOT NULL,
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL,
  password text NOT NULL,
  isadmin BOOLEAN DEFAULT false,
  loggedin BOOLEAN,
  PRIMARY KEY (userid),
  UNIQUE (email)
);

CREATE TABLE organization
(
  orgid SERIAL NOT NULL,
  orgname text NOT NULL,
  PRIMARY KEY (orgid)
);

CREATE TABLE part_of
(
  userid SERIAL NOT NULL,
  orgid SERIAL NOT NULL,
  PRIMARY KEY (userid, orgid),
  FOREIGN KEY (userid) REFERENCES "user"(userid) ON DELETE CASCADE,
  FOREIGN KEY (orgid) REFERENCES organization(orgid) ON DELETE CASCADE
);

CREATE TABLE collection
(
  collectionname text,
  collectionid SERIAL NOT NULL,
  userid SERIAL NOT NULL,
  orgid SERIAL,
  PRIMARY KEY (collectionid),
  FOREIGN KEY (userid) REFERENCES "user"(userid) ON DELETE CASCADE,
  FOREIGN KEY (orgid) REFERENCES organization(orgid) ON DELETE CASCADE,
  UNIQUE (collectionname)
);

CREATE TABLE note
(
  noteid SERIAL NOT NULL,
  notename text,
  notedate timestamp,
  typednotes TEXT,
  collectionid SERIAL NOT NULL,
  PRIMARY KEY (noteid),
  FOREIGN KEY (collectionid) REFERENCES collection(collectionid) ON DELETE CASCADE
);

CREATE TABLE study_plan
(
  planid SERIAL NOT NULL,
  studydate DATE NOT NULL,
  time TIME,
  timeamount INT,
  prioritylevel INT NOT NULL,
  studycompleted BOOLEAN DEFAULT false,
  noteid SERIAL NOT NULL,
  PRIMARY KEY (planid),
  FOREIGN KEY (noteid) REFERENCES note(noteid) ON DELETE CASCADE
);

CREATE TABLE questions
(
  questionid SERIAL NOT NULL,
  questiontext TEXT NOT NULL,
  answer TEXT,
  noteid SERIAL NOT NULL,
  PRIMARY KEY (questionid),
  FOREIGN KEY (noteid) REFERENCES note(noteid) ON DELETE CASCADE
);

CREATE TABLE links
(
  linkid SERIAL NOT NULL,
  url TEXT NOT NULL,
  noteid SERIAL NOT NULL,
  PRIMARY KEY (linkid),
  FOREIGN KEY (noteid) REFERENCES note(noteid) ON DELETE CASCADE
);

CREATE TABLE words
(
  wordid SERIAL NOT NULL,
  vocabword TEXT NOT NULL,
  definition TEXT NOT NULL,
  noteid SERIAL NOT NULL,
  PRIMARY KEY (wordid),
  FOREIGN KEY (noteid) REFERENCES note(noteid) ON DELETE CASCADE,
  UNIQUE (vocabword)
);

CREATE TABLE shared_collection
(
	collectionid SERIAL NOT NULL,
	userid SERIAL NOT NULL,
	ownerid SERIAL NOT NULL,
	PRIMARY KEY (collectionid, userid, ownerid),
	FOREIGN KEY (collectionid) REFERENCES collection (collectionid) ON DELETE CASCADE,
	FOREIGN KEY (userid) REFERENCES "user" (userid) ON DELETE CASCADE,
	FOREIGN KEY (ownerid) REFERENCES "user" (userid) ON DELETE CASCADE
);

CREATE TABLE shared_note
(
	noteid SERIAL NOT NULL,
	userid SERIAL NOT NULL,
	ownerid SERIAL NOT NULL,
	PRIMARY KEY (noteid, userid, ownerid),
	FOREIGN KEY (noteid) REFERENCES note (noteid) ON DELETE CASCADE,
	FOREIGN KEY (userid) REFERENCES "user" (userid) ON DELETE CASCADE,
	FOREIGN KEY (ownerid) REFERENCES "user" (userid) ON DELETE CASCADE
);


create or replace view see_orgs as
  select o.orgname, u.email, o.orgid
  from organization o inner join part_of p on o.orgid = p.orgid 
  inner join "user" u on p.userid = u.userid
  order by o.orgid asc;
  --this will be filtered later

create or replace view see_collections as
  select c.collectionname, o.orgid, u.userid, u.email, c.collectionid
  from collection c inner join organization o
  on c.orgid = o.orgid inner join "user" u
  on c.userid = u.userid
  order by c.collectionid asc;
  --this will be filtered later

create or replace view see_notes as
	select n.noteid, n.notename, c.collectionid, u.email
	from note n inner join collection c on n.collectionid = c.collectionid
	inner join "user" u on c.userid = u.userid
	order by n.noteid asc;
	--this will be filtered later
  
create or replace view see_note_with_data as
  select n.noteid, n.notename, n.notedate, n.typednotes, c.collectionname
  from note n left join collection c on n.collectionid = c.collectionid
  --this will be filtered later

create or replace view see_words as
 	select * from words
	order by wordid asc;
	--this will be filtered later

create or replace view see_questions as
 	select * from questions
	order by questionid asc;
	--this will be filtered later

create or replace view see_links as
 	select * from links
	order by linkid asc;
	--this will be filtered later
  
create or replace view see_study_plans as
  select n.notename, n.notedate, s.studydate, s.timeamount, 
  	s.prioritylevel, s.studycompleted, s.time, s.planid, n.noteid
  from note n inner join study_plan s on n.noteid = s.noteid
  order by s.studydate asc, s.time asc;
  --this will be filtered later

create or replace view see_all_plans as
	select n.notename, n.notedate, s.studydate, s.timeamount,
  		s.prioritylevel, s.studycompleted, s.time, s.planid, n.noteid, u.userid
	from note n inner join study_plan s on n.noteid = s.noteid
	inner join collection c on n.collectionid = c.collectionid
	inner join "user" u on c.userid = u.userid
	where s.studycompleted = false
	order by n.notename asc, s.studydate asc, s.time asc;
	--this will be filtered later

create view see_personal_data as
  select * from "user";
  --this will be filtered later
  
create or replace view admin_see_all_users as
  select * from "user" order by isadmin desc, firstname asc;

create or replace view admin_see_all_orgs as
  select o.orgid, o.orgname, count(p.orgid) as members
  from organization o inner join part_of p
  on o.orgid = p.orgid
  group by o.orgid
  order by o.orgname asc;

create or replace view admin_see_all_colls as
	select c.collectionname, c.collectionid, c.userid, c.orgid, o.orgname, u.firstname, u.lastname,
		count(n.noteid) as numnotes
	from note n inner join collection c on n.collectionid = c.collectionid
	inner join organization o on c.orgid = o.orgid
	inner join "user" u on c.userid = u.userid
	group by c.collectionname, c.collectionid, o.orgname, u.firstname, u.lastname
	order by u.firstname asc;

create or replace view admin_see_all_notes as
  select n.noteid, n.notename, n.notedate, n.collectionid, c.collectionname, c.userid, u.firstname, u.lastname
  from note n inner join collection c on n.collectionid = c.collectionid
  inner join "user" u on c.userid = u.userid
  order by u.firstname asc, c.collectionname asc;

create or replace view admin_see_user_orgs as
  select o.orgid, o.orgname, u.userid
  from organization o inner join part_of p on o.orgid = p.orgid
  inner join "user" u on p.userid = u.userid;
  --this will be filtered later

create or replace view admin_see_user_colls as
	select c.collectionname, c.collectionid, c.userid, c.orgid, 
		o.orgname, count(n.noteid) as numnotes
	from collection c inner join note n on c.collectionid = n.collectionid
	inner join organization o on o.orgid = c.orgid
	group by c.collectionname, c.collectionid, o.orgname
	order by c.collectionname asc;
  --this will be filtered later

create or replace view admin_see_user_notes as
	select n.noteid, n.notename, n.collectionid, n.notedate, u.userid, c.collectionname
	from note n inner join collection c on n.collectionid = c.collectionid
	inner join "user" u on c.userid = u.userid;
  --this will be filtered later

create or replace view admin_see_org_users as
  select u.firstname, u.lastname, u.email, u.userid, p.orgid
  from "user" u inner join part_of p
  on p.userid = u.userid
  order by u.firstname asc;
  --this will be filtered later

create or replace view admin_see_coll_notes as
  select c.collectionname, n.noteid, n.notename, n.notedate, n.collectionid
  from collection c inner join note n
  on c.collectionid = n.collectionid
  order by n.notename asc;
  --this will be filtered later



CREATE OR REPLACE FUNCTION trigger_set_last_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.notedate = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_update_timestamp
BEFORE UPDATE ON note
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_last_modified_timestamp();


CREATE TRIGGER set_insert_timestamp
BEFORE INSERT ON note
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_last_modified_timestamp();


CREATE OR REPLACE FUNCTION
  public.signup(firstname text, lastname text, email text, "password" text) RETURNS VOID
  AS $$
    INSERT INTO "user" (firstname, lastname, email, "password") VALUES
      (signup.firstname, signup.lastname, signup.email, crypt(signup.password, gen_salt('bf', 8)));
  $$ LANGUAGE sql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION
  public.login(email text, password text) RETURNS jwt_token
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  DECLARE
    _role NAME;
    result jwt_token;
  BEGIN
    SELECT "user".userid FROM "user" WHERE "user".email = login.email AND "user".password = crypt(login.password, "user".password) INTO _role;
    IF _role IS NULL THEN
      RAISE invalid_password USING message = 'invalid user or password';
    END IF;

    SELECT sign(
        row_to_json(r), current_setting('app.settings.jwt_secret')
      ) AS token
      from (
        SELECT 'admins' AS role, login.email AS email, _role AS user_id,
          extract(epoch from now())::integer + 3600*60*60 as exp
      ) r
      INTO result;

    RETURN result;
  END;
  $$

CREATE ROLE authenticator NOINHERIT;
CREATE ROLE admins;
CREATE ROLE anonymous;

GRANT anonymous, admins TO authenticator;

GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO anonymous;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admins;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admins;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admins;

GRANT EXECUTE ON FUNCTION
  public.login(text, text),
  public.signup(text, text, text, text)
  TO anonymous;

ALTER TABLE <table_name> ADD CONSTRAINT cascade_delete
	FOREIGN KEY (<id>) REFERENCES <table_name> (<id>) ON DELETE CASCADE;
