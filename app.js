(function() {

  return {
    events: {
		'app.activated':'getInfo',
		'click .search':'getSearch',
		'click .back':'getInfo'
    },
	requests: {
		//*return JSON data for user ID*//
		userGetRequest: function(id) {
			//console.log('return user id: ' + id);
			return {
				url: '/api/v2/users/' + id + '.json',

				type:'GET',
				dataType: 'json'
			};
		},
		//*return JSON data for org ID*//
		orgGetRequest: function(id) {
			//console.log('return org id: ' + id);
			return {

			//async:false,
			url: '/api/v2/organizations/' + id + '.json',

			type:'GET',
			dataType: 'json'
			};
		},
		
		//*return JSON data for search*//
		relatedSearchSettings: function(status, subject, createdate, assignee, requester, organization, description) {
			var type = 'type:ticket+';
			var url = '/api/v2/search.json?query=' + status + type + subject + createdate + assignee + requester + organization + description ;
			url = url.substring(0, url.length - 1);
			console.log('URL ' + url);
			return {
				// url: '/api/v2/search.json?query={' + status + type + subject + createdate + assignee + requester + '}',
				url: url,
				//url: '/api/v2/search.json?query={status' + status + ' type:ticket ' + 'subject:' + subject + ' created' + createop + createdate + 'assignee:' + assignee + ' reqester: ' + requester + '}',
				type:'GET',
				dataType: 'json'
			};
		}
		
	},
	//END REQUESTS
	
	formatDates: function(data) {
			var cdate = new Date(data.results.created_at);
			var ldate = new Date(data.results.updated_at);
			data.user.created_at = cdate.toLocaleDateString();
			data.user.last_login_at = ldate.toLocaleString();
		return data;
	},
	
	//*On activation switch to input form*//
	getInfo: function() {
		this.switchTo('input');
	},
	
	//*on search get input and make ajax search request*//	
	getSearch: function() {
		var organization = this.$('#organization')[0].value;
		if(organization !== ''){
			organization = 'organization:' + organization + '+' ;
			}
		var createdate = this.$('#createdate')[0].value;
		var createop = this.$('#createop')[0].value;
		if(createdate !== ''){
			createdate = 'created' + createop + createdate + '+' ;
			}
		var subject = this.$('#subject')[0].value;
		if(subject !== ''){
			subject = 'subject:' + subject + '+' ;
			}
		var assignee = this.$('#assignee')[0].value;
		if(assignee !== ''){
			assignee = 'assignee:' + assignee + '+' ;
			}
		var requester = this.$('#requester')[0].value;
		if(requester !== ''){
			requester = 'requester:' + requester + '+' ;
			}
		var description = this.$('#description')[0].value;
		if(description !== ''){
			description = 'description:' + description + '+' ;
			}
		var status = this.$('#status')[0].value;
		if(status !== ''){
			status = 'status: ' + status + '+' ;
			}

		//console.log('The create date is ' + createdate);
		//console.log('The create operator is ' + createop);
		//console.log('The assignee is ' + assignee);
		//console.log('The subject is ' + subject);
		//console.log('The requester is ' + requester);
		//console.log('The Status is ' + status);
		//console.log('The organization is ' + organization);
		var request = this.ajax('relatedSearchSettings', status, subject, createdate, assignee, requester, organization, description);
			request.done(this.showInfo); 
			//request.done(this.limitResults); 
			request.fail(this.showError);
	},

	limitResults: function(data) {
		var topTen;
		data = data.slice(0, 11);
		//topTen = data.results.slice(0, 11);
		this.showInfo(data);
	},
	
	showInfo: function(data) {
		var i;
		var orgName;
		var assigneeUserName;
		var requesterUserName;
		var instance = this;
		var results = data.results;

		//console.log(results.length);
		//debugger;
		for(i = 0; i < results.length; i++) {
			
			//convert URL to real web link
			var link = results[i].url;
			var res = link.replace("api/v2", "agent");
			var res2 = res.replace(".json", "");
				//console.log('Modified URL ' + res2);
			data.results[i].url = res2;
			//change data format
			var cdate = new Date(data.results[i].created_at);
			var ldate = new Date(data.results[i].updated_at);
			data.results[i].created_at = cdate.toLocaleDateString();
			data.results[i].updated_at = ldate.toLocaleString();
			
		}

		this.switchTo('search', data);
	},
	
	showError: function() {
		this.switchTo('error');
	}
  };

}());