CREATE TABLE "user"
(
  userid SERIAL NOT NULL,
  firstname text NOT NULL,
  lastname text NOT NULL,
  email text NOT NULL,
  isadmin BOOLEAN DEFAULT false,
  onboarded BOOLEAN DEFAULT false,
  noteonboarded BOOLEAN DEFAULT false,
  subscriptionstatus text NOT NULL DEFAULT 'inactive',
  notifsettings BOOLEAN NOT NULL DEFAULT true,
  lastaicall TEXT DEFAULT '',
  numaicalls INT DEFAULT 0,
  PRIMARY KEY (userid),
  UNIQUE (email)
);

CREATE TABLE organization
(
  orgid SERIAL NOT NULL,
  orgname text NOT NULL,
  isprivate BOOLEAN DEFAULT false,
  joincode text unique,
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

CREATE TABLE folder
(
  folderid SERIAL NOT NULL,
  foldername text,
  orgid SERIAL,
  userid SERIAL,
  parent INT default null,
  ispublic BOOLEAN default false,
  PRIMARY KEY (folderid),
  FOREIGN KEY (orgid) REFERENCES organization(orgid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES "user"(userid) ON DELETE CASCADE,
  FOREIGN KEY (parent) REFERENCES folder(folderid) ON DELETE CASCADE
);

CREATE TABLE collection
(
  collectionname text,
  collectionid SERIAL NOT NULL,
  userid SERIAL NOT NULL,
  orgid SERIAL,
  folderid INT DEFAULT null,
  parent INT default null,
  color TEXT NOT NULL DEFAULT '#D3D3D3',
  PRIMARY KEY (collectionid),
  FOREIGN KEY (userid) REFERENCES "user"(userid) ON DELETE CASCADE,
  FOREIGN KEY (folderid) REFERENCES folder(folderid) ON DELETE CASCADE,
  FOREIGN KEY (orgid) REFERENCES organization(orgid) ON DELETE CASCADE,
  FOREIGN KEY (parent) REFERENCES folder(folderid) ON DELETE CASCADE
);

CREATE TABLE todo
(
  todoid SERIAL NOT NULL,
  todotext TEXT NOT NULL,
  deadline DATE NOT NULL,
  completed BOOLEAN NOT NULL default false,
  collectionid SERIAL NOT NULL,
  userid INT DEFAULT NULL,
  PRIMARY KEY (todoid),
  FOREIGN KEY (collectionid) REFERENCES "collection"(collectionid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES "user"(userid) ON DELETE CASCADE
);

CREATE TABLE note
(
  noteid SERIAL NOT NULL,
  notename text,
  notedate timestamp,
  typednotes TEXT,
  collectionid SERIAL,
  parent INT default null,
  externalsharing BOOLEAN NOT NULL DEFAULT false,
  userid INT,
  deckid INT DEFAULT NULL,
  PRIMARY KEY (noteid),
  FOREIGN KEY (collectionid) REFERENCES collection(collectionid) ON DELETE CASCADE,
  FOREIGN KEY (parent) REFERENCES folder(folderid) ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES "user"(userid) ON DELETE CASCADE,
  FOREIGN KEY (deckid) REFERENCES decks(deckid)
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

CREATE TABLE links
(
  linkid SERIAL NOT NULL,
  url TEXT NOT NULL,
  noteid SERIAL NOT NULL,
  PRIMARY KEY (linkid),
  FOREIGN KEY (noteid) REFERENCES note(noteid) ON DELETE CASCADE
);

CREATE TABLE prepared_words
(
  wordid SERIAL NOT NULL,
  word TEXT NOT NULL,
  noteid SERIAL NOT NULL,
  PRIMARY KEY (wordid),
  FOREIGN KEY (noteid) REFERENCES note(noteid) ON DELETE CASCADE
);

CREATE TABLE whiteboards
(
  boardid SERIAL NOT NULL,
  uid VARCHAR(20) NOT NULL,
  noteid SERIAL NOT NULL,
  PRIMARY KEY (boardid),
  FOREIGN KEY (noteid) REFERENCES note(noteid) ON DELETE CASCADE
);

CREATE TABLE flashcards
(
  cardid SERIAL NOT NULL,
  cardprompt TEXT NOT NULL,
  cardanswer TEXT NOT NULL,
  noteid SERIAL,
  deckid INT DEFAULT NULL,
  PRIMARY KEY (cardid),
  FOREIGN KEY (noteid) REFERENCES note(noteid) ON DELETE CASCADE,
  FOREIGN KEY (deckid) REFERENCES decks(deckid) ON DELETE CASCADE
);

CREATE TABLE decks
(
	deckid SERIAL not null,
	deckname TEXT not null,
	userid SERIAL not null,
  orgid SERIAL not null,
  ispublic BOOLEAN DEFAULT false,
	PRIMARY KEY (deckid),
  FOREIGN KEY (userid) REFERENCES "user"(userid) ON DELETE CASCADE,
  FOREIGN KEY (orgid) REFERENCES organization(orgid) ON DELETE CASCADE
);

CREATE TABLE quiz
(
  quizid SERIAL NOT NULL,
  noteid INT,
  quizname TEXT NOT NULL,
  userid INT NOT NULL,
  ispublic BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (quizid),
  FOREIGN KEY (noteid) references note (noteid),
  FOREIGN KEY (userid) references "user" (userid)
);

CREATE TABLE question
(
  questionid SERIAL NOT NULL,
  quizid INT,
  noteid INT,
  questiontext TEXT NOT NULL,
  answers TEXT NOT NULL,
  PRIMARY KEY (questionid),
  FOREIGN KEY (quizid) references quiz (quizid),
  FOREIGN KEY (noteid) references note (noteid)
);

CREATE TABLE note_in_deck
(
  noteid INT NOT NULL,
  deckid INT NOT NULL,
  PRIMARY KEY (noteid, deckid),
  FOREIGN KEY (noteid) references note (noteid),
  FOREIGN KEY (deckid) references decks (deckid) ON DELETE CASCADE
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

CREATE TABLE shared_folder
(
	folderid SERIAL NOT NULL,
	userid SERIAL NOT NULL,
	ownerid SERIAL NOT NULL,
	PRIMARY KEY (folderid, userid, ownerid),
	FOREIGN KEY (folderid) REFERENCES folder (folderid) ON DELETE CASCADE,
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

CREATE TABLE "reset_code"
(
  codeid SERIAL NOT NULL,
  code VARCHAR NOT NULL,
  codeemail VARCHAR NOT NULL,
  codeexpiration VARCHAR NOT NULL,
  PRIMARY KEY (codeid),
  UNIQUE (code)
);

-- VIEWS

CREATE OR REPLACE VIEW get_daily_plans AS
	SELECT
			u.userid,
			u.firstname,
			u.email,
			array_agg(n.notename) AS notenames,
			array_agg(s.time ORDER BY s.time asc) AS times,
			array_agg(DISTINCT s.planid) AS planids,
			s.studydate
	FROM
			"user" u
	INNER JOIN collection c ON u.userid = c.userid
	INNER JOIN note n ON c.collectionid = n.collectionid
	INNER JOIN study_plan s ON n.noteid = s.noteid
	WHERE
			u.notifsettings = true
			AND s.studycompleted = false
			AND DATE(s.studydate) = CURRENT_DATE
	GROUP BY
			u.userid,
			u.firstname,
			u.email,
			s.studydate
	ORDER BY
			u.userid;

CREATE VIEW export_data AS
  SELECT 
    u.userid, o.orgid, o.orgname, 
    c.collectionid, c.collectionname, 
    n.noteid, n.notename, n.typednotes, 
    w.boardid, w.uid, 
    f.cardid, f.cardprompt, f.cardanswer
  FROM 
      "user" u
  INNER JOIN 
      part_of p ON u.userid = p.userid
  INNER JOIN 
      organization o ON p.orgid = o.orgid
  INNER JOIN 
      collection c ON u.userid = c.userid AND o.orgid = c.orgid
  LEFT JOIN 
      note n ON c.collectionid = n.collectionid
  LEFT JOIN 
      whiteboards w ON n.noteid = w.noteid
  LEFT JOIN 
      flashcards f ON n.noteid = f.noteid
  ORDER BY 
      o.orgid, c.collectionid, n.noteid, w.boardid, f.cardid;
  --this will be filtered later

create or replace view see_orgs as
  select o.orgname, u.email, o.orgid, o.joincode
  from organization o inner join part_of p on o.orgid = p.orgid 
  inner join "user" u on p.userid = u.userid
  order by o.orgid asc;
  --this will be filtered later

create or replace view see_collections as
  select c.collectionname, o.orgid, u.userid, u.email, c.collectionid, c.color, c.folderid, c.parent
  from collection c inner join organization o
  on c.orgid = o.orgid inner join "user" u
  on c.userid = u.userid
  order by c.collectionid asc;
  --this will be filtered later

create or replace view see_folder_colls as
  select * from collection;
  --this will be filtered later

create or replace view see_task_folders as
	select * from folder;
	--this will be filtered later

create or replace view see_task_colls as
	select * from collection;
	--this will be filtered later

create or replace view see_task_folder_colls as
	select * from collection;
	--this will be filtered later

create or replace view see_content_notes as
  select n.noteid, n.notename, n.parent, n.userid
  from note n order by n.notename asc;
  --this will be filtered later

create or replace view see_folders as
	select * from folder;
	--this will be filtered later

create or replace view see_todo_list as
  select * from todo
  order by deadline asc, topic asc;
  -- this will be filtered later

create or replace view see_todo_due_today as
  select t.todoid, t.todotext, t.deadline, t.completed, t.topic, t.userid
  from todo t where t.completed = false
  order by t.topic asc;
  -- this will be filtered later

create or replace view see_notes as
	select n.noteid, n.notename, c.collectionid, u.email, c.orgid, c.collectionname, c.color, c.folderid, c.parent
	from note n inner join collection c on n.collectionid = c.collectionid
	inner join "user" u on c.userid = u.userid
	order by n.noteid asc;
	--this will be filtered later

create or replace view see_note_with_data as
  select n.noteid, n.notename, n.notedate, n.typednotes, u.userid                        
  from note n inner join "user" u on n.userid = u.userid;
  --this will be filtered later

CREATE OR REPLACE VIEW see_note_quiz_questions AS
	select * from question;
	--this will be filtered later

create or replace view see_flashcards as
 	select * from flashcards
	order by cardid asc;
	--this will be filtered later

CREATE OR REPLACE VIEW see_all_flashcard_decks AS
  select * from decks
  order by deckid;
  --this will be filtered later

CREATE OR REPLACE VIEW see_all_public_decks AS
  SELECT d.deckname, d.deckid, d.userid, d.orgid, d.ispublic, o.orgname, u.firstname, u.lastname
  FROM decks d
  INNER JOIN "user" u ON d.userid = u.userid
  INNER JOIN organization o ON o.orgid = d.orgid
  WHERE d.ispublic = true
  order by d.deckname;

create or replace view see_flashcard_deck as
	SELECT
			f.cardid, 
			f.cardprompt, 
			f.cardanswer, 
			f.noteid, 
			d.deckid
	FROM decks d
	LEFT JOIN note_in_deck nid ON d.deckid = nid.deckid
	LEFT JOIN note n ON nid.noteid = n.noteid
	LEFT JOIN flashcards f ON n.noteid = f.noteid OR (f.noteid IS NULL AND d.deckid = nid.deckid)
	WHERE n.noteid IS NOT NULL
	UNION
	SELECT
			f.cardid, 
			f.cardprompt, 
			f.cardanswer, 
			f.noteid, 
			d.deckid
	FROM decks d
	LEFT JOIN note_in_deck nid ON d.deckid = nid.deckid
	LEFT JOIN flashcards f ON d.deckid = f.deckid
	WHERE nid.noteid IS NULL;
	--this will be filtered later

create or replace view see_prepared_words as
  select * from prepared_words
  order by wordid asc;
  --this will be filtered later

create or replace view see_whiteboards as
  select * from whiteboards
  order by boardid asc;
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

create or replace view see_personal_data as
  select * from "user";
  --this will be filtered later

create or replace view admin_get_email_group as
	select email from "user";
	--this will be filtered later
  
create or replace view admin_see_all_users as
  select * from "user" order by isadmin desc, firstname asc;

create or replace view admin_see_all_orgs as
  select o.orgid, o.orgname, count(p.orgid) as members, o.joincode, o.isprivate
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
  select o.orgid, o.orgname, u.userid, o.isprivate, o.joincode
  from organization o inner join part_of p on o.orgid = p.orgid
  inner join "user" u on p.userid = u.userid;
  --this will be filtered later

create or replace view admin_see_user_colls as
	select c.collectionname, c.collectionid, c.userid, c.orgid, 
		o.orgname, count(n.noteid) as numnotes, c.folderid
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
  select c.collectionname, n.noteid, n.notename, n.notedate, n.collectionid, c.folderid
  from collection c inner join note n
  on c.collectionid = n.collectionid
  order by n.notename asc;
  --this will be filtered later

create or replace view search_users as
	select u.firstname, u.lastname, u.userid, u.email, p.orgid
	from "user" u inner join part_of p
	on u.userid = p.userid
	order by u.firstname asc, u.lastname asc;
	--this will be filtered later

create or replace view see_shared_colls as
	select s.collectionid, s.userid, s.ownerid, u.email
	from shared_collection s inner join "user" u
	on s.userid = u.userid;
	--this will be filtered later

create or replace view see_shared_folders as
	select s.folderid, s.userid, s.ownerid, u.email
	from shared_folder s inner join "user" u
	on s.userid = u.userid;
	--this will be filtered later

create or replace view see_shared_notes as
	select s.noteid, s.userid, s.ownerid, u.email
	from shared_note s inner join "user" u
	on s.userid = u.userid;
	--this will be filtered later

create or replace view see_colls_shared_with_me as
	select s.collectionid, s.userid, s.ownerid, c.collectionname, c.orgid, u.firstname, u.lastname, c.color
	from shared_collection s inner join collection c on s.collectionid = c.collectionid
	inner join "user" u on u.userid = c.userid
	order by c.collectionname asc;
	--this will be filtered later

create or replace view see_folders_shared_with_me as
	select s.folderid, s.userid, s.ownerid, f.foldername, f.orgid, u.firstname, u.lastname
	from shared_folder s inner join folder f on s.folderid = f.folderid
	inner join "user" u on u.userid = f.userid
	order by f.foldername asc;
	--this will be filtered later

create or replace view see_notes_shared_with_me as
	select s.noteid, s.userid, s.ownerid, n.notename, u.firstname, u.lastname
	from shared_note s inner join note n on s.noteid = n.noteid
	inner join "user" u on n.userid = u.userid
	order by n.notename asc;
	--this will be filtered later

create or replace view see_public_orgs as
	select o.orgname, o.orgid, o.isprivate, o.joincode, count(p.orgid) as members
	from organization o inner join part_of p
	on o.orgid = p.orgid
	where isprivate = false
	group by o.orgname, o.orgid
	order by o.orgname asc;

create or replace view search_org_by_code as
	select o.orgname, o.orgid, o.isprivate, o.joincode, count(p.orgid) as members
	from organization o inner join part_of p
	on o.orgid = p.orgid
	group by o.orgname, o.orgid;
	--this will be filtered later


-- FUNCTIONS
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


CREATE or REPLACE FUNCTION public.get_notes_for_deck(user_id INT, org_id INT, deck_id INT)
  RETURNS TABLE (
      noteid INT,
      notename text,
      userid INT,
      foldername text,
      orgid INT,
      deckid INT,
      is_in_deck BOOLEAN
  )
  AS $$
  BEGIN
    RETURN QUERY
    SELECT
        n.noteid,
        n.notename,
        n.userid,
        f.foldername,
        f.orgid,
        nid.deckid,
        CASE WHEN nid.deckid IS NOT NULL AND nid.deckid = deck_id THEN true ELSE false END AS is_in_deck
    FROM
        note n
    LEFT JOIN
        note_in_deck nid ON n.noteid = nid.noteid
    INNER JOIN
        folder f ON n.parent = f.folderid
    WHERE
        (nid.deckid IS NOT NULL OR NOT EXISTS (
                SELECT 1
                FROM note_in_deck nd
                WHERE nd.noteid = n.noteid
        ))
        AND n.userid = user_id
        AND f.orgid = org_id
    ORDER BY
        is_in_deck DESC, f.foldername, n.notename;
  END;
  $$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION
  public.signup(firstname text, lastname text, email text) RETURNS VOID
  AS $$
    INSERT INTO "user" (firstname, lastname, email) VALUES
      (signup.firstname, signup.lastname, signup.email);
  $$ LANGUAGE sql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION
  public.login(email text, password text) RETURNS jwt_token
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  DECLARE
    _role NAME;
    result jwt_token;
  BEGIN
    SELECT "user".userid FROM "user" WHERE "user".email = login.email INTO _role;
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
  public.signup(text, text, text)
  TO anonymous;

ALTER TABLE <table_name> ADD CONSTRAINT cascade_delete
	FOREIGN KEY (<id>) REFERENCES <table_name> (<id>) ON DELETE CASCADE;

-- Use SQL to create a policy.
ALTER TABLE storage.buckets DISABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

create policy "Public Access"
  on storage.buckets for select;
