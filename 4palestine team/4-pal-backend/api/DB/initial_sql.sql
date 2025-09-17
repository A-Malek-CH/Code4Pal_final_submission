-- users

create table users (
  id serial primary key,
  user_type varchar(20) not null check (user_type in ('anonymous','registered','contributor','organization','admin')),
  email varchar(255) unique,
  first_name varchar(100),
  last_name varchar(100),
  phone_number varchar(30),
  is_email_verified boolean default false,
  is_phone_verified boolean default false,
  preferred_language varchar(10),
  registration_date timestamp default now()
);


create table emergency_info (
  id serial primary key,
  user_id int not null references users(id) on delete cascade,
  blood_type varchar(5),
  medical_conditions varchar(255), -- could split into another table if multiple needed
  allergies varchar(255)
);


create table emergency_contacts (
  id serial primary key,
  emergency_info_id int not null references emergency_info(id) on delete cascade,
  name varchar(100),
  relationship varchar(50),
  phone_number varchar(30)
);


create table user_statistics (
  id serial primary key,
  user_id int not null references users(id) on delete cascade,
  sos_activations int default 0,
  locations_marked int default 0,
  reports_submitted int default 0
);


create table contributor_data (
  id serial primary key,
  user_id int not null unique references users(id) on delete cascade,
  contributor_type varchar(20) check (contributor_type in ('individual','organization')),
  verification_status varchar(20) check (verification_status in ('pending','approved','rejected','suspended')),
  verified boolean default false,
  motivation text
);


create table application_data (
  id serial primary key,
  contributor_id int not null references contributor_data(id) on delete cascade,
  submitted_at timestamp,
  reviewed_at timestamp,
  reviewed_by int references users(id)
);


create table application_documents (
  id serial primary key,
  application_id int not null references application_data(id) on delete cascade,
  doc_type varchar(50),
  file_name varchar(255),
  upload_date timestamp,
  verified boolean default false
);


create table organization_info (
  id serial primary key,
  contributor_id int not null references contributor_data(id) on delete cascade,
  organization_name varchar(255),
  registration_number varchar(100),
  physical_address text,
  website_url varchar(255),
  facebook varchar(255),
  twitter varchar(255)
);


create table contributor_performance (
  id serial primary key,
  contributor_id int not null references contributor_data(id) on delete cascade,
  locations_created int default 0,
  locations_verified int default 0
);

-- locations
create table locations (
  id serial primary key,
  created_by int not null references users(id),
  latitude decimal(9,6),
  longitude decimal(9,6),
  address text,
  category varchar(30) check (category in ('food_distribution','medical_facility','water_source','refuge_camp','danger_zone')),
  created_at timestamp default now(),
  title varchar(255),
  description text,
  organization varchar(255),
  capacity varchar(100),
  start_time time,
  end_time time
);


create table location_schedule (
  id serial primary key,
  location_id int not null references locations(id) on delete cascade,
  day_of_week varchar(20) check (day_of_week in ('monday','tuesday','wednesday','thursday','friday','saturday','sunday'))
);




create table location_verifications (
  id serial primary key,
  location_id int not null references locations(id) on delete cascade,
  status varchar(20) check (status in ('verified','unverified')),
  verified_by int references users(id),
  verified_at timestamp
);


create table location_reports (
  id serial primary key,
  location_id int not null references locations(id) on delete cascade,
  reported_by int references users(id),
  reported_at timestamp default now(),
  description text
);

-- emergency
create table emergencies (
  id serial primary key,
  activated_by int references users(id),
  latitude decimal(9,6),
  longitude decimal(9,6),
  accuracy int,
  address text,
  activated_at timestamp default now(),
  emergency_type varchar(20) check (emergency_type in ('medical','trapped','fire','violence','other')),
  description text,
  estimated_victims int,
  medical_info text
);
