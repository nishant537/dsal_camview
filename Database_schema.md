1. For all_user table:
```
CREATE TABLE `all_user` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(256) NOT NULL,
  `last_name` varchar(256) DEFAULT NULL,
  `user_name` varchar(64) NOT NULL,
  `password` varchar(128) NOT NULL,
  `dashboard_access` blob,
  `site_access` blob,
  `status` varchar(64) DEFAULT "active",
  PRIMARY KEY (`ID`),
  UNIQUE KEY `user_name` (`user_name`)
);

insert into all_user(first_name,user_name,password,dashboard_access,site_access) values ("Admin", "admin", "admin", '{"provisioning":["view_camera","add_camera"],"alert_dashboard":["view_alert"],"user_management":["add_user","view_user","delete_user"]}','{"default":["default"]}');
```

2. For all_cam table:
```
CREATE TABLE `all_cam` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `JSON` blob,
  `NAME` varchar(55) DEFAULT NULL,
  `status` varchar(64) DEFAULT "active",
  PRIMARY KEY (`ID`),
  UNIQUE KEY `NAME` (`NAME`)
);
```

3. For all_alert table:
```
CREATE TABLE `all_alert` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `alert_id` int DEFAULT NULL,
  `feature_type` varchar(45) NOT NULL,
  `cluster` varchar(45) DEFAULT NULL,
  `site` varchar(45) DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  `sub_location` varchar(45) DEFAULT NULL,
  `camera_name` varchar(64) DEFAULT NULL,
  `section` varchar(64) DEFAULT NULL,
  `ip` varchar(64) NOT NULL,
  `channel` int DEFAULT NULL,
  `port` int DEFAULT NULL,
  `alert_timestamp` varchar(64) DEFAULT NULL,
  `status` int DEFAULT '1',
  `image_path` text,
  `video_path` text,
  `crowd_count` int DEFAULT NULL,
  `tailgating_time` int DEFAULT NULL,
  `tailgating_vehicle` int DEFAULT NULL,
  `vehicle_type` int DEFAULT NULL,
  `vehicle_number` int DEFAULT NULL,
  `idle_time` int DEFAULT NULL,
  `type` varchar(64) DEFAULT NULL,
  `corrected_feature` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`ID`)
);
```

4. For all_template table:
```
CREATE TABLE `all_template` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `JSON` blob,
  `NAME` varchar(55) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `NAME` (`NAME`)
);
```

5. Update group by settings:
```
SET GLOBAL sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));
```

> NOTE - Following drop commands will delete the complete table with its data, to retain data and change only schema 
```
alter table <table_name> add column <column_name> <datatype> after <after_column>;
```

DROP ALL EXISTING TABLES, CREATE ALL ABOVE
```
drop table all_user;
drop table all_cam;
drop table all_alert;
drop table all_template;
```
