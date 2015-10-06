$(function() {
    $('table').bootstrapTable({
      columns: [{
	field: 'login',
	title: 'Login',
	sortable: true
      }, {
	field: 'firstname',
	title: 'Prénom',
	sortable: true
      }, {
	field: 'lastname',
	title: 'Nom',
	sortable: true
      }, {
	field: 'city',
	title: 'Ville'
      }, {
	field: 'promo',
	title: 'Promo'
      }, {
	field: 'availableSpices',
	title: 'Épices',
	order: 'desc',
	sortable: true
      }, {
	field: 'credits',
	title: 'Crédits',
	order: 'desc',
	sortable: true
      }, {
	field: 'gpaBachelor',
	title: 'GPA',
	order: 'desc',
	sortable: true
      }]
    });
  $.get('/api/2018/', function(data) {
    $('table').bootstrapTable('load', data)
  });
});
