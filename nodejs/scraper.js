// a file to scrape a faculty courses assignments into a csv file
const puppeteer = require('puppeteer');
const MAINCONFIG = require('./config/mainconfig.js');
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
  await page.keyboard.type(MAINCONFIG.username)
  // IF NOT NULL
  // await page.click(initialNavigation.SIGNIN_NEXT); // some sites have a next btn
  await page.focus(initialNavigation.PASSWORD_SELECTOR);
  await page.keyboard.type(MAINCONFIG.password);

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
  for (let i = 0; i < courseList.length; i++) {
    const element = courseList[i];

    console.log("navigating to:" + element.name)
    console.log("navigating to:" + element.href)

    await page.goto(element.href);
    // await page.waitForNavigation();

    await page.waitFor(3 * 1000);

    if(i==0)
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
        const element = assign[k];
        // console.log(element.innerText);
        var fulltext = element.innerText
        removeWords.forEach(word => {
          fulltext = fulltext.replace(word, "")

        });
        // var indexOfStevie = myArray.findIndex(i => i.hello === "stevie");
        console.log(fulltext)
        var notes = ""
        var finalTxt = fulltext;
        var due_date;
        var notification;
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
        if (fulltext.indexOf(cutOff) != -1) {
          finalTxt = fulltext.substr(0, fulltext.indexOf(cutOff))
          notes += fulltext.substr(fulltext.indexOf(cutOff), fulltext.length)
          //  due_date;
          // currentDate.getFullYear()
          // var result = "On ";
          // t = fulltext;
          // var sub = t.substr(0, 17);
          // t = t.substr(17);
          // result += sub + "at ";

          // retrieve time
          //   var pre = t.substr(0, 2);
          //   t = t.substr(2, 3);
          //   var suffix = "am";
          //   if (parseInt(pre) > 11) {
          //     suffix = "pm";
          //     if (pre != 12) {
          //       pre = parseInt(pre) - 12;
          //     }
          //   }
          //   result += pre + t + suffix;
          // }
          // retrieve date
          var monthIndex = -1;
          var monthNum = -1;
          var monthName = ""
          // monthIndex=monthNames.indexOf()
          for (let j = 0; j < monthNames.length; j++) {
            const element = monthNames[j];
            monthIndex = fulltext.indexOf(element)
            monthName = element;
            monthNum = monthNames.indexOf(element) + 1
            if (monthIndex != -1)
              break

          }
          // monthNames.forEach(month => {
          //   monthIndex = fulltext.indexOf(month)
          //   monthNum=monthNames.indexOf(month)+1
          //   if(monthIndex!=-1)
          //     throw
          // });

          if (monthIndex != -1 && fulltext.indexOf("at") != -1) {

            var atIndex = fulltext.substr(monthName.length + monthIndex, fulltext.indexOf("at") - (fulltext.length - fulltext.indexOf("at")));
            parseInt(atIndex)

          }
          // if(monthIndex!=-1)
          // monthIndex++;

          var secondDate = new Date(MAINCONFIG.course.defaultYear || currentDate.getFullYear(), 03, monthNum);




          // var finalTxt = fulltext.indexOf(cutOff) == -1 ? fulltext : fulltext.substr(0, fulltext.indexOf(cutOff))
          console.log("finalTxt:" + finalTxt)

          try {
            var href = element.querySelector("div > div > div > div > a").href
            console.log(href)
            notes += "\n" + href
          } catch (error) {
            // console.log(error)
          }
          console.log("Notes:" + notes)
          if (k == 25)
            break;
        }
      } // end assignments 4 loop

      // will need to go to table of contents, 
      // get all assignments, assign priority, gives notes and due date
      // then by name find quizzes & assignments and get direct href
      // exiting on 2nd element
      if (i == 1) {
        break;
      }
    }
    // exit();
    // await page.waitForNavigation();

  }
  console.log("finished course traversal" + end())

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
