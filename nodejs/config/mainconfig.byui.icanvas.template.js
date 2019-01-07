module.exports = {
	urlList: {
		login: 'https://secure.byui.edu/cas/login?service=https%3A%2F%2Fbyui.instructure.com%2Flogin%2Fcas',
		courses: 'https://byui.instructure.com/courses'
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
		coursesSelector: "table#my_courses_table tr.course-list-table-row",
		courseNameSelector: `td.course-list-course-title-column.course-list-no-left-border`,
		// courseLinkSelector: "",
		courseHrefFunction: `.querySelector("td.course-list-course-title-column.course-list-no-left-border > a").href`,
		hrefStartString: null,
		hrefEndString: null,
		skipCourses: ["Devotional - Winter 2019"]
	},
	course: {
		defaultYear: 2019,
		contentSelector: "div.d2l-navigation-s-main-wrapper > div:nth-child(1) > a",
		// tobSelector: "#TreeItemTOC",
		tobCSelector: `a[title="Syllabus"]`,
		assignmentSelector: "div.d2l-collapsepane-content > div > div> div> div.d2l-datalist-container.d2l-datalist-style1 > ul.d2l-datalist.vui-list > li.d2l-datalist-item.d2l-datalist-simpleitem",
		assignmentDetailSelector: { name: "td.name", href: "td.name > a" }, // can be multi
		meridiem: ["pm","am"],
		selectors: [],
		removeWords: ["I'm Done"],
		cutOff: [{ word: "", monthDay_word: ", 2019", notification_word: "due by" }],
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