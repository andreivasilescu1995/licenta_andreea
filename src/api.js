import axios from 'axios';

var api = {};
var apiUrl = 'http://127.0.0.1:5000/'

api.post = (url, data) => {
    return api.request('POST', url, data);
};

api.get = (url, data) => {
    return api.request('GET', url, data);
};

api.request = (method, url, data) => {
    return new Promise((resolve, reject) => {
        method = method.toUpperCase();
        url = apiUrl + url;
        let headers = {};
        headers['Content-Type'] = 'application/json';

        api.sendRequest(method, url, headers, data)
            .then(response => {
                resolve(response);
            })
            .catch(response => {
                if (response.status !== 400 && response.status !== 500)
                    reject(response)
            });
    });
};

api.sendRequest = (method, url, headers, data) => {
    return new Promise((resolve, reject) => {
        let options = {
            method: method,
            url: url,
            headers: headers,
        };
        if (method == 'GET') options.params = data;
        else options.data = data;

        axios(options)
            .then(response => {
                resolve(response);
            })
            .catch(({ response }) => {
                resolve(response);
            });
    });
};

export default api;
