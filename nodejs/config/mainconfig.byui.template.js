module.exports = {
	urlList: {
		login: 'https://secure.byui.edu/cas/login',
		courses: 'https://byui.brightspace.com/d2l/home'
	},
	istdSettings: {
		inputFile: "iStudiez Pro Data Backup 9:16:18",
		defaultDueDate: 17838,
		def_course_uid: 30142136452
	},
	scrape: {
	},
	initialNavigation: {
		USERNAME_SELECTOR: '#username',
		SIGNIN_BTN: '#hero-banner-sign-in-to-office-365-link',
		SIGNIN_NEXT: '#idSIButton9',
		PASSWORD_SELECTOR: '#password',
		BUTTON_SELECTOR: '#box > section.row.btn-row > input.btn-login',
		NO_BTN: "#idBtn_Back",
		SHAREPOINT_LINK: "#ShellSites_link"
	},
	courseList: {
		coursesSelector: "#courses > div:nth-child(1) > div:nth-child(2) > div",
		courseNameSelector: `div:nth-child(2)[id*="info"] > div:nth-child(1)`,
		// courseLinkSelector: "",
		courseHrefFunction: `.querySelector("div > div:nth-child(2)").getAttribute('onclick')`,
		hrefStartString: "location.href='",
		hrefEndString: "';",
		skipCourses: ["BIO"]
	},
	course: {
		defaultYear: 2019,
		contentSelector: "div.d2l-navigation-s-main-wrapper > div:nth-child(1) > a",
		tobSelector: "#TreeItemTOC",
		tobCSelector: "div.d2l-collapsepane-content > div > div> div> div.d2l-datalist-container.d2l-datalist-style1 > ul.d2l-datalist.vui-list > li.d2l-datalist-item.d2l-datalist-simpleitem",
		assignmentSelector: "div.d2l-collapsepane-content > div > div> div> div.d2l-datalist-container.d2l-datalist-style1 > ul.d2l-datalist.vui-list > li.d2l-datalist-item.d2l-datalist-simpleitem",
		assignmentDetailSelector: { href: "div > div > div > div > a" }, // can be multi
		selectors: [],
		meridiem: ["PM", "AM"],
		removeWords: ["I'm Done"],
		cutOff: [{ word: "Due", notification_word: "at" }, { word: "Ends", notification_word: ", 2019" }],
		priorities: [
			{
				keywords: ['exam', "report", "project"],
				priority: 3
			},
			{
				keywords: ['quiz', "due"],
				priority: 2
			}
		],
		defaultPriority: 2
	},
	headless: false,
	closeBrowser: false
}