// constants
var CURRENCIES = { // a dictionary of currency data indexed by code
	AUD: {
		name: 'Australian Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>',
		defaultDisplay: true
	},
	CAD: {
		name: 'Canadian Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>',
		defaultDisplay: true
	},
	CNY: {
		name: 'Chinese Yuan',
		symbol: '¥',
		icon: '<i class="fas fa-yen-sign"></i>'
	},
	EUR: {
		name: 'Euro',
		symbol: '€',
		icon: '<i class="fas fa-euro-sign"></i>',
		defaultCard: true,
		defaultDisplay: true
	},
	GBP: {
		name: 'British Pound',
		symbol: '£',
		icon: '<i class="fas fa-pound-sign"></i>',
		defaultCard: true,
		defaultDisplay: true
	},
	HKD: {
		name: 'Hong Kong Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>'
	},
	IDR: {
		name: 'Indian Rupee',
		symbol: '₹',
		icon: '<i class="fas fa-rupee-sign"></i>'
	},
	ILS: {
		name: 'Israeli Shekel',
		symbol: '₪',
		icon: '<i class="fas fa-shekel-sign"></i>'
	},
	JPY: {
		name: 'Japanese Yen',
		symbol: '¥',
		icon: '<i class="fas fa-yen-sign"></i>',
		defaultDisplay: true
	},
	KRW: {
		name: 'South Korean Won',
		symbol: '₩',
		icon: '<i class="fas fa-won-sign"></i>'
	},
	MXN: {
		name: 'Mexican Peso',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>'
	},
	NZD: {
		name: 'New Zealand Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>',
		defaultDisplay: true
	},
	RUB: {
		name: 'Russian Ruble',
		symbol: '₽',
		icon: '<i class="fas fa-ruble-sign"></i>'
	},
	SGD: {
		name: 'Singapore Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>'
	},
	TRY: {
		name: 'Turkish Lira',
		symbol: '₺',
		icon: '<i class="fas fa-lira-sign"></i>'
	},
	USD: {
		name: 'US Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>',
		defaultCard: true,
		defaultDisplay: true
	}
};
var SORTED_CURRENCY_CODES = Object.keys(CURRENCIES).sort();
var CURRENCY_API_URL = 'https://api.exchangeratesapi.io/latest';