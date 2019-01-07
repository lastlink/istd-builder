# nodejs sqlite project

* Purpose of this is to bulk import assignments into a istd istudiez backup and then restore with new assignments.
* This project will do so using a .csv file. INITIAL part done see ISSUES below.
* It may also have support scraping different faculty websites to pull assignment data into a csv file automatically PENDING

## technologies used

* nodejs > v8
* puppeteer
* sqlite
* csv

## reverse engineer db

* `sequelize-auto -h localhost -d ../ruby/main.db -e sqlite -c ./config/config.json -o "./schema/"`

## GETTING STARTED

* `cd` into this directory
* `npm install`
* If using an earlier version of nodejs before 8 use nvm to change
  * `nvm install 8`
  * `nvm use 8` version installed
* Copy config files
  * `cp config/config.template.json config/config.json`
  * `cp config/mainconfig.template.js config/mainconfig.js`
  * `cp config/creds.template.js config/creds.js`
* init istd folder
    * `mkdir -p istd`
* Copy template from templates/ to input/ and fill in new assignments. Scraper may autogenerate this when done. E.g. `cp templates/assignments_template.csv input/assignments_template.csv` Type in new assignemnt
* Settings
    * Backup from istudiez a new db file to the `input/` folder and change file name in `config/mainconfig.js` **inputFile** to match input.
        * create any new courses first before running a backup
        * In istudiez click on `Data > Create Data Backup`
    * Setup proper inputs in the new config files under `config`

## Run Project

* Scraper
    * `node scraper.js`
* Migrate Scraped data to istudiez backup, having issues with **bulk import** and sqlite lite database locks
    * fix csv file before importing
        * rename columns to `priority	due_date	notes	course_uid	notification_time	name	is_new	is_local	notify` paste special as text
        * make `is_new` and `is_local` set to 1, `notify` set to 1 if there is a value in `notification_time`
        * replace coursenames with course_uid in sqlite db. If they don't exist create them.
    * use a program such as [sqlitebrowser], open `main.db` then import csv into temp table such as `assignments_tmp` then run
        ```sql
        INSERT INTO assignments(priority,	due_date,	notes,	course_uid,	notification_time,	name,	is_new,	is_local,	notify) SELECT * FROM assignments_tmp;
        ```
    * Issues with database locks - Run project `node index.js` or `npm start`

## Issues

* Haven't figured out the datestamp calculation for assignments. From what I can tell the days are a count of days from the start date of the project and the timestamps represent something else. E.g.
  * Time does appear to be a reprensative of minutes in military time. So just divide notification_time by 60 to get minutes.
  * due_date seems to be a count of days from `1/1/70`

| due_date | notification_time | name                    |
|----------|-------------------|-------------------------|
| 17821    | 54060             |  test 10/17/2018,3:01pm |
| 17792    | 50460             | test 9/18/2018 2:01pm   |
| 17791    | 46860             | test 9/17/2018 1:01pm   |
| 17790    | 46800             | test 9/16/2018 1pm      |