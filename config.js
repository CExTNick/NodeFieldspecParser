module.exports = {
	/* List of names that are reserved, if no form specified it is
	reserved for all form types */
	reservedFields : [
		{name: 'id'},
		{name: 'caseId'},
		{name: 'number'},
		{name: 'createdDate'},
		{name: 'createdBy'},
		{name: 'createdDate'},
		{name: 'caseNumber'},
		{name: 'createdByName'},
		{name: 'caseTitle'},
		{name: 'caseData'},
		{form : 'case', name: 'isActiveRecord'},
		{form : 'case', name: 'caseSource'},
		{form : 'case', name: 'categoryLevel1'},
		{form : 'case', name: 'categoryLevel2'},
		{form : 'case', name: 'categoryLevel3'},
		{form : 'case', name: 'closeReason'},
		{form : 'case', name: 'cancelReason'},
		{form : 'case', name: 'reopenReason'},
		{form : 'case', name: 'cancelDate'},
		{form : 'case', name: 'caseStatus'},
		{form : 'case', name: 'caseType'},
		{form : 'case', name: 'parent'},
		{form : 'case', name: 'owner'},
		{form : 'case', name: 'investigativeTeamMembers'},
		{form : 'case', name: 'userBlacklist'},
		{form : 'case', name: 'assignmentStatus'},
		{form : 'case', name: 'declineReason'},
		{form : 'case', name: 'reassignReason'}
	]
}