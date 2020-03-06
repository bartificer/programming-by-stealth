// constants
var CURRENCIES = { // a dictionary of currency data indexed by code
	AUD: {
		name: 'Australian Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>',
		defaultDisplay: true,
		decimalDigits: 2
	},
	CAD: {
		name: 'Canadian Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>',
		defaultDisplay: true,
		decimalDigits: 2
	},
	CNY: {
		name: 'Chinese Yuan',
		symbol: '¥',
		icon: '<i class="fas fa-yen-sign"></i>',
		decimalDigits: 2
		
	},
	EUR: {
		name: 'Euro',
		symbol: '€',
		icon: '<i class="fas fa-euro-sign"></i>',
		defaultCard: true,
		defaultDisplay: true,
		decimalDigits: 2
	},
	GBP: {
		name: 'British Pound',
		symbol: '£',
		icon: '<i class="fas fa-pound-sign"></i>',
		defaultCard: true,
		defaultDisplay: true,
		decimalDigits: 2
	},
	HKD: {
		name: 'Hong Kong Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>',
		decimalDigits: 2
	},
	ILS: {
		name: 'Israeli Shekel',
		symbol: '₪',
		icon: '<i class="fas fa-shekel-sign"></i>',
		decimalDigits: 2
	},
	INR: {
		name: 'Indian Rupee',
		symbol: '₹',
		icon: '<i class="fas fa-rupee-sign"></i>',
		decimalDigits: 2
	},
	JPY: {
		name: 'Japanese Yen',
		symbol: '¥',
		icon: '<i class="fas fa-yen-sign"></i>',
		defaultDisplay: true,
		decimalDigits: 0
	},
	KRW: {
		name: 'South Korean Won',
		symbol: '₩',
		icon: '<i class="fas fa-won-sign"></i>',
		decimalDigits: 0
	},
	MXN: {
		name: 'Mexican Peso',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>',
		decimalDigits: 2
	},
	NZD: {
		name: 'New Zealand Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>',
		defaultDisplay: true,
		decimalDigits: 2
	},
	RUB: {
		name: 'Russian Ruble',
		symbol: '₽',
		icon: '<i class="fas fa-ruble-sign"></i>',
		decimalDigits: 2
	},
	SGD: {
		name: 'Singapore Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>',
		decimalDigits: 2
	},
	TRY: {
		name: 'Turkish Lira',
		symbol: '₺',
		icon: '<i class="fas fa-lira-sign"></i>',
		decimalDigits: 2
	},
	USD: {
		name: 'US Dollar',
		symbol: '$',
		icon: '<i class="fas fa-dollar-sign"></i>',
		defaultCard: true,
		defaultDisplay: true,
		decimalDigits: 2
	}
};
var SORTED_CURRENCY_CODES = Object.keys(CURRENCIES).sort();
var CURRENCY_API_URL = 'https://api.exchangeratesapi.io/latest';