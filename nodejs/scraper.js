// a file to scrape a faculty courses assignments into a csv file
const puppeteer = require('puppeteer');
const MAINCONFIG = require('./config/mainconfig.js');
const CREDS = require('./config/creds.js');

var startTime, endTime;
startTime = new Date();
/** return time elapsed */
function end() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds 
  var seconds = Math.round(timeDiff);
  // console.log(seconds + " seconds");
  return "-" + seconds + " seconds";
}

async function run() {
  const browser = await puppeteer.launch({
    headless: MAINCONFIG.headless,
    args: ["--ash-host-window-bounds=1920x1080", "--window-size=1920,1048", "--window-position=0,0"]
  });

  const page = await browser.newPage();

  // await page.goto('https://github.com');
  // await page.screenshot({ path: 'screenshots/github.png' });

  await page.goto(MAINCONFIG.urlList.login);

  // dom element selectors
  // const USERNAME_SELECTOR = '//input[@type=\'email\']';
  // const USERNAME_SELECTOR = 'input[type="email"]';
  // const USERNAME_SELECTOR = '#i0116';

  const initialNavigation = MAINCONFIG.initialNavigation;
  // const SIGNIN_NEXT = '#idSIButton9';
  // const PASSWORD_SELECTOR = '#i0118';
  // const NO_BTN = "#idBtn_Back";
  console.log("logging into course website" + end())
  // steps to click signin before login page
  // IF NOT NULL
  // await page.click(initialNavigation.SIGNIN_BTN);
  // await page.waitForNavigation();

  await page.focus(initialNavigation.USERNAME_SELECTOR)
  await page.keyboard.type(CREDS.username)
  // IF NOT NULL
  // await page.click(initialNavigation.SIGNIN_NEXT); // some sites have a next btn
  await page.focus(initialNavigation.PASSWORD_SELECTOR);
  await page.keyboard.type(CREDS.password);

  await page.waitFor(2000);
  await page.click(initialNavigation.BUTTON_SELECTOR);
  // some websites have a save computer button after signin
  // await page.waitFor(initialNavigation.NO_BTN);
  // await page.click(initialNavigation.NO_BTN);
  await page.waitForNavigation();

  await page.goto(MAINCONFIG.urlList.courses);
  await page.waitForNavigation();

  await page.waitFor(2 * 1000);
  console.log("finished logging in" + end())
  // get courses list urls
  // insert into course list as
  // {
  //   name: "",
  //   href: "",
  //   assignments: []
  // }
  // var data = document.querySelectorAll(MAINCONFIG.courseList.coursesSelector);
  await page.waitFor(MAINCONFIG.courseList.coursesSelector);
  var courseList = await page.evaluate((courseListConfig) => {
    var tmpList = [];
    const courses = Array.from(document.querySelectorAll(courseListConfig.coursesSelector));

    for (let i = 0; i < courses.length; i++) {
      const row = courses[i];
      try {


        var course = {

          assignments: []
        }

        var cText = row.querySelector(courseListConfig.courseNameSelector).innerText;
        course.name = cText;
        var href = ""
        if (courseListConfig.courseHrefFunction) {
          href = eval('row' + courseListConfig.courseHrefFunction);
          href = href.substr(courseListConfig.hrefStartString.length, href.indexOf(courseListConfig.hrefEndString) - courseListConfig.hrefStartString.length)

        }
        course.href = href;

        tmpList.push(course)
      }
      catch (error) {
        console.log("failed to retrieve input value")
        console.log(error)
        tmpList.push(error.toString())
      }
    }
    // tmpList.push({
    //   name: "",
    //   href: "",
    //   assignments: []
    // }) 

    return tmpList;
  }, MAINCONFIG.courseList)
  // iterate over each course
  console.log("finished course parsing" + end())
  console.log(courseList);
  var assignmentHeader = ["priority", "due_date", "notes", "course_name", "notify", "name"]
  var fullassignmentList = [];
  for (let i = 0; i < courseList.length; i++) {
    const course = courseList[i];

    console.log("navigating to:" + course.name)
    console.log("navigating to:" + course.href)

    await page.goto(course.href);
    // await page.waitForNavigation();

    await page.waitFor(3 * 1000);

    if (i == 0)
      continue;
    if (MAINCONFIG.course.contentSelector) {
      console.log("clicking course btn")

      await page.click(MAINCONFIG.course.contentSelector);
      await page.waitFor(2 * 1000);

      // await page.waitForNavigation();
    }
    if (MAINCONFIG.course.tobSelector) {
      console.log("clicking tob btn")

      await page.click(MAINCONFIG.course.tobSelector);
      await page.waitFor(2 * 1000);

      // await page.waitForNavigation();
    }

    // div.d2l-datalist-container.d2l-datalist-style1 > ul> li > 
    // div.d2l-collapsepane-content > div > div> div> div.d2l-datalist-container.d2l-datalist-style1 > ul.d2l-datalist.vui-list > li.d2l-datalist-item.d2l-datalist-simpleitem
    if (MAINCONFIG.course.tobCSelector) {
      // generate assignments list
      await page.waitFor(MAINCONFIG.course.assignmentSelector);
      var assignmentList = await page.evaluate((courseConfig) => {

        var assignList = []
        var assign = document.querySelectorAll("div.d2l-collapsepane-content > div > div> div> div.d2l-datalist-container.d2l-datalist-style1 > ul.d2l-datalist.vui-list > li.d2l-datalist-item.d2l-datalist-simpleitem")

        var priorities = [
          {
            keywords: ['exam', "report", "project"],
            priority: 3
          },
          {
            keywords: ['quiz', "due"],
            priority: 2
          }
        ]
        var defaultPriority = 2;
        var removeWords = ["I'm Done"]
        var cutOff = "Due"
        var currentDate = new Date;
        var lastDate;
        var firstDate = new Date(1970, 01, 12);
        var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds


        for (let k = 0; k < assign.length; k++) {
          var assignment = []
          var diffDays = ""
          var notes = ""
          var notification_time = "";


          const element = assign[k];
          console.log(element.innerText);
          var fulltext = element.innerText
          removeWords.forEach(word => {
            fulltext = fulltext.replace(word, "")

          });
          // var indexOfStevie = myArray.findIndex(i => i.hello === "stevie");

          var priority = defaultPriority;
          var priorityObj = -1;

          for (let p = 0; p < priorities.length; p++) {
            for (let k = 0; k < priorities[p].keywords.length; k++) {
              const keyword = priorities[p].keywords[k];
              if (fulltext.indexOf(keyword) != -1) {

                priority = priorities[p].priority
                break;
              }
            }
            if (priorityObj != -1)
              break;

          }
          // console.log(priorityObj)
          // var indexOfPriority = priorities.findIndex(i => { 
          //   i.keywords.indexOf(fulltext)
          // );
          // console.log(fulltext)
          var finalTxt = fulltext;
          var due_date;
          var notification;
          var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
          if (fulltext.indexOf(cutOff) != -1) {
            finalTxt = fulltext.substr(0, fulltext.indexOf(cutOff))
            notes += fulltext.substr(fulltext.indexOf(cutOff), fulltext.length)

            // retrieve date
            var monthIndex = -1;
            var monthNum = -1;
            var monthName = ""
            // monthIndex=monthNames.indexOf()
            for (let j = 0; j < monthNames.length; j++) {
              const element = monthNames[j];
              monthIndex = notes.indexOf(element)
              if (monthIndex != -1) {
                monthNum = monthNames.indexOf(element)
                monthName = element;
                break
              }

            }
            // console.log(monthIndex)
            // console.log(monthNum)

            // console.log(monthName)

            var monthDay = -1;
            var hours = 0;
            var minutes = 0;
            if (monthIndex != -1 && notes.indexOf("at") != -1) {
              // console.log(fulltext)
              // console.log(monthName.length + monthIndex)
              // console.log(fulltext.indexOf(monthName))

              // console.log(monthIndex)
              // console.log(fulltext.indexOf("at"))
              // console.log(fulltext.indexOf("at") - (monthName.length + monthIndex))
              monthDay = notes.substr(monthName.length + monthIndex, notes.indexOf("at") - (monthName.length + monthIndex));
              // console.log(parseInt(atIndex))

              // retrieve time
              var hourIndex = notes.indexOf("at") + "at".length
              var minutIndex = notes.indexOf(":") + ":".length

              var prefixIndex = notes.indexOf("PM")
              var hourOffset = 0;
              if (prefixIndex != -1) {
                hourOffset = 12
              } else
                prefixIndex = notes.indexOf("AM")

              // console.log(hourIndex + ":" + minutIndex + ":" + prefixIndex)


              if (hourIndex != -1 & minutIndex != -1 & prefixIndex != -1) {
                // console.log( minutIndex - (fulltext.length - minutIndex))
                hours = notes.substr(hourIndex, minutIndex - hourIndex - 1)
                hours = isNaN(parseInt(hours)) ? 0 : parseInt(hours) + hourOffset
                // console.log("hr:" + hours)
                minutes = notes.substr(minutIndex, prefixIndex - minutIndex - 1)
                minutes = isNaN(parseInt(minutes)) ? 0 : parseInt(minutes)

                // console.log( prefixIndex - (fulltext.length - prefixIndex))

                // console.log("minutes:" + minutes)
              }



            }
            // console.log("monthday:" + monthDay)


            // if(monthIndex!=-1)
            // monthIndex++;
            var secondDate = new Date();
            if (monthDay != -1 && monthNum != -1) {
              secondDate = new Date(courseConfig.defaultYear || currentDate.getFullYear(), monthNum, monthDay, hours, minutes);
            }
            // var date  = new Date(2018,11,3,05,30)


            // console.log(secondDate)

            diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
            // var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);

            // console.log(diffDays)
            if (hours != 0 || minutes != 0)
              notification_time = secondDate.getHours() * 60 * 60 + secondDate.getMinutes() * 60
            // console.log(notification_time)
            // console.log("
            // days":)


            // var finalTxt = fulltext.indexOf(cutOff) == -1 ? fulltext : fulltext.substr(0, fulltext.indexOf(cutOff))
            // console.log("finalTxt:" + finalTxt)

            try {
              var href = element.querySelector("div > div > div > div > a").href
              console.log(href)
              notes += "\n" + href
            } catch (error) {
              // console.log(error)
            }
            // console.log("Notes:" + notes)
            // if (k == 25)
            //   break;
          } else {
            // may be a reading a ssignment set priorty to 1
            priority = 1;

          }
          // console.log("prioty" + priority)
          assignment.push(priority);
          assignment.push(diffDays);
          assignment.push(notes)
          // assignment.push(course.name)
          assignment.push(notification_time)
          assignment.push(finalTxt)
          console.log(assignment)
          assignList.push(assignment)
        } // end assignments 4 loop
        return assignList;
      }, MAINCONFIG.course);

      console.log("assignment list")
      // console.log(assignmentList)
      
      fullassignmentList = fullassignmentList.concat(assignmentList);

      // will need to go to table of contents, 
      // get all assignments, assign priority, gives notes and due date
      // then by name find quizzes & assignments and get direct href
      // exiting on 2nd element
      if (i == 1) {
        break;
      }
    } // end table of contents selector
    // await page.waitForNavigation();

  } // end courselist for loop
  var stringify = require('csv-stringify');
  var fs = require('fs');


  console.log("finished course traversal" + end())
  stringify(fullassignmentList, { header: true, columns: assignmentHeader }, (err, output) => {
    if (err) throw err;
    fs.writeFile('./input/assignments_scraped.csv', output, (err) => {
      if (err) throw err;
      console.log('assignments_scraped.csv saved.');
    });
  });

  exit();


  // export final results to input/assignments_template

  if (MAINCONFIG.closeBrowser)
    browser.close();
}


async function retrieveRows(page) {
  const NUM_USER_SELECTOR = '#js-pjax-container > div > div.columns > div.column.three-fourths.codesearch-results > div > div.d-flex.flex-justify-between.border-bottom.pb-3 > h3';

  let inner = await page.evaluate((sel) => {
    let html = document.querySelector(sel).innerHTML;

    // format is: "69,803 users"
    return html.replace(',', '').replace('users', '').trim();
  }, NUM_USER_SELECTOR);

  const numUsers = parseInt(inner);

  console.log('numUsers: ', numUsers);

  /**
   * GitHub shows 10 resuls per page, so
   */
  return Math.ceil(numUsers / 10);
}
run();
