import axios from 'axios'

class API {
    apiUrl = 'https://deciding-iguana-relaxed.ngrok-free.app'
    
    constructor(){
        axios.defaults.baseURL = this.apiUrl
        axios.interceptors.request.use(function (config) {
            const params = window.location.search.slice(1);
            config.headers['Authorization'] = params
            config.headers['ngrok-skip-browser-warning'] = '1'
            return config;
        }, function (error) {
            return Promise.reject(error);
        });
    }

    getImage(path){
        return `${this.apiUrl}/face-swapper/image?path=${path}`
    }
    
    async getFolders(gen) {
        const sex = gen == 2 ? 'male' : 'female'
        const {data} = await axios.get(`face-swapper/base-images?sex=${sex}`)
        return data
    }

    async getUser(id) {
        const {data} = await axios.get(`/face-swapper/limits/${id}`, "GET")
        return data
    }

    async setUser(id) {
        await axios.put(`/face-swapper/limits/${id}`)
    }

    async uploadPhoto(photo, uploadUrl) {
        const {data} = await axios.post(`vk/upload`, {photo, uploadUrl})
        return data
    }

    async generate(id, img, photo) {
        const form = new FormData()
        form.set('id', id)
        form.set('source', img, img.name)
        form.set('target', photo.name)
        const { data } = await axios.post('face-swapper', form)
        return data.id
    }

    async getResult(id){
        const {data} = await axios.get('face-swapper/result/'+id)
        return data 
    }

}

export default new API()