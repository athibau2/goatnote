CREATE TABLE "user"
(
  UserId SERIAL NOT NULL,
  FirstName varchar(20) NOT NULL,
  LastName varchar(20) NOT NULL,
  Email varchar(100) NOT NULL,
  Password varchar(50) NOT NULL,
  IsAdmin BOOLEAN DEFAULT false,
  loggedin BOOLEAN DEFAULT false,
  PRIMARY KEY (UserId),
  UNIQUE (Email)
);

CREATE TABLE Organization
(
  OrgId SERIAL NOT NULL,
  OrgName varchar(20) NOT NULL,
  PRIMARY KEY (OrgId)
);

CREATE TABLE Part_Of
(
  UserId SERIAL NOT NULL,
  OrgId SERIAL NOT NULL,
  PRIMARY KEY (UserId, OrgId),
  FOREIGN KEY (UserId) REFERENCES "user"(UserId),
  FOREIGN KEY (OrgId) REFERENCES Organization(OrgId)
);

CREATE TABLE Collection
(
  CollectionName varchar(20),
  CollectionId SERIAL NOT NULL,
  UserId SERIAL NOT NULL,
  OrgId SERIAL,
  PRIMARY KEY (CollectionId),
  FOREIGN KEY (UserId) REFERENCES "user"(UserId),
  FOREIGN KEY (OrgId) REFERENCES Organization(OrgId),
  UNIQUE (CollectionName)
);

CREATE TABLE Note
(
  NoteId SERIAL NOT NULL,
  NoteName varchar(100),
  TypedNotes TEXT,
  CollectionId SERIAL NOT NULL,
  PRIMARY KEY (NoteId),
  FOREIGN KEY (CollectionId) REFERENCES Collection(CollectionId)
);

CREATE TABLE Study_Plan
(
  PlanId SERIAL NOT NULL,
  StudyDate DATE NOT NULL,
  TimeAmount INT,
  PriorityLevel INT NOT NULL,
  StudyCompleted BOOLEAN DEFAULT false,
  NoteId SERIAL NOT NULL,
  PRIMARY KEY (PlanId),
  FOREIGN KEY (NoteId) REFERENCES Note(NoteId)
);

CREATE TABLE Questions
(
  QuestionId SERIAL NOT NULL,
  QuestionText TEXT NOT NULL,
  Answer TEXT,
  NoteId SERIAL NOT NULL,
  PRIMARY KEY (QuestionId),
  FOREIGN KEY (NoteId) REFERENCES Note(NoteId)
);

CREATE TABLE Links
(
  LinkId SERIAL NOT NULL,
  Url TEXT NOT NULL,
  NoteId SERIAL NOT NULL,
  PRIMARY KEY (LinkId),
  FOREIGN KEY (NoteId) REFERENCES Note(NoteId)
);

CREATE TABLE Words
(
  WordId SERIAL NOT NULL,
  VocabWord TEXT NOT NULL,
  Definition TEXT NOT NULL,
  NoteId SERIAL NOT NULL,
  PRIMARY KEY (WordId),
  FOREIGN KEY (NoteId) REFERENCES Note(NoteId),
  UNIQUE (VocabWord)
);



create or replace view see_orgs as
  select o.orgName, u.email, o.orgid
  from organization o inner join part_of p on o.orgid = p.orgid 
  inner join "user" u on p.userid = u.userid order by o.orgId;
  --this will be filtered later

create or replace view see_collections as
  select c.collectionName, o.orgid, u.userid, u.email, c.collectionid
  from collection c inner join organization o
  on c.orgid = o.orgid inner join "user" u
  on c.userid = u.userid
  order by o.orgid;
  --this will be filtered later

create or replace view see_notes as
	select n.noteid, n.notename, c.collectionid, u.email
	from note n inner join collection c on n.collectionid = c.collectionid
	inner join "user" u on c.userid = u.userid
	order by n.collectionid;
	--this will be filtered later
  
create or replace view see_note_with_data as
  select n.noteid, n.noteName, n.notedate, n.typedNotes, c.collectionName
  from note n left join collection c on n.collectionId = c.collectionId
  --this will be filtered later

create or replace view see_words as
 	select * from words;
	--this will be filtered later

create or replace view see_questions as
 	select * from questions;
	--this will be filtered later

create or replace view see_links as
 	select * from links;
	--this will be filtered later
  
create or replace view see_study_plans as
  select n.noteName, n.notedate, s.studydate, s.timeamount, 
  	s.prioritylevel, s.studycompleted, s.time, s.planid, n.noteid
  from note n inner join study_plan s on n.noteid = s.noteid
  order by s.studydate asc;
  --this will be filtered later

create view see_personal_data as
  select firstName, lastName, email, "password"
  from "user";
  --this will be filtered later
  
create view admin_see_all_users as
  select * from "user";

create view admin_see_user_orgs_collections as
  select o.orgId, o.orgName, c.collectionName, firstName, lastName 
  from collection c inner join organization o 
  on c.orgId = o.orgId inner join "user" on c.userId = "user".userId;
  --this will be filtered later

create view admin_see_org_users as
  select o.orgName, firstname, lastname
  from organization o inner join part_of p
  on o.orgId = p.orgId inner join "user"
  on p.userId = "user".userId
  order by o.orgName;
  --this will be filtered later

create view admin_see_user_collections_notes as
  select o.orgId, c.collectionName, n.notename, firstname, lastname
  from organization o inner join collection c on o.orgId = c.orgId
  inner join note n on c.collectionId = n.collectionId
  inner join "user" on c.userId = "user".userId
  order by "user".userId;
  --this will be filtered later

create view admin_see_user_note_data as
  select u.userId, u.firstname, u.lastname, c.collectionId, n.notename, n.typedNotes, n.notedate,
    q.questiontext, q.answer, w.vocabword, w.definition, l.url
  from "user" u inner join collection c on c.userId = u.userId 
  inner join note n on c.collectionId = n.collectionId
  inner join questions q on n.noteId = q.noteId
  inner join words w on n.noteId = w.noteId
  inner join links l on n.noteId = l.noteId
  order by u.userId;
  --this will be filtered later



CREATE OR REPLACE FUNCTION trigger_set_last_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.noteDate = NOW();
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
  public.login(email text, "password" text) RETURNS jwt_token
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

    --UPDATE "user" SET loggedin = true WHERE "user".userid = login.userid;
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

ALTER TABLE <> ADD CONSTRAINT cascade_delete 
	FOREIGN KEY (<id>) REFERENCES <> (<id>) ON DELETE CASCADE;
