'use strict'
let params = new URLSearchParams(location.search);
fetchTranscript({university: 'NTHU', account: params.get('account'), token: params.get('ACIXSTORE')}).
then(console.log);
