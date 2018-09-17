// a file to scrape a faculty courses assignments into a csv file
const puppeteer = require('puppeteer');
const MAINCONFIG = require('./config/mainconfig.js');

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
  console.log("logging into course website")
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
  console.log("finished logging in")
  // get courses list urls
  // MAINCONFIG.courseList.coursesSelector

  // var courseList = []
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
    // return courseListConfig.coursesSelector;
    const courses = Array.from(document.querySelectorAll(courseListConfig.coursesSelector));
    // return courses.length;
    return courses[0].innerHTML;
    tmpList.push({
      name: "",
      href: "",
      assignments: []
    })
    // for (let i = 0; i < courses.length; i++) {
    var tmpRow = ""
    tmpRow = courses.forEach(row => {
      return row.innerHTML;
      // return row.innerHTML;
      try {
        var cText = row.querySelector(courseListConfig.courseNameSelector);
        // console.log(cText)
        course.name = cText;

        var course = {

          assignments: []
        }
        // const row = data[i];
        // console.log(element.innerText)
        // console.log(i)
        // console.log(row.querySelectorAll("div"))
        var href = ""
        if (courseListConfig.courseHrefFunction) {
          href = eval('row' + courseListConfig.courseHrefFunction);

          // console.log(href.substr(MAINCONFIG.courseList.hrefStartString.length, href.indexOf(MAINCONFIG.courseList.hrefEndString) - MAINCONFIG.courseList.hrefStartString.length))

        }
        // var href = element.querySelector("div > div:nth-child(2)").getAttribute('onclick')
        // console.log(href)
        course.href = href;
        // data[0].querySelector("div > div:nth-child(2)").getAttribute('onclick')

        return course;
        // console.log(element.querySelector("div:nth-child(2) > div:nth-child(1)").innerText)
        tmpList.push(course)
      }
      catch (error) {
        console.log("failed to retrieve input value")

        console.log(error)
        return error;
      }
    })
    return tmpRow
    return tmpList;
  }, MAINCONFIG.courseList)
  // iterate over each course
  console.log("finished course parsing")
  console.log(courseList);
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
