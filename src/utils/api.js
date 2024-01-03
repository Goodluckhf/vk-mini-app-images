import request from "./request"

class API {
    async getFolders(gen) {
        // face-swap/base-images?sex=male|female

        // Demo Bспользуюся фото из приложения-примера
        let data = await request('https://xx10.ru/photo/api.php', "POST", {
            gen, //sex
            type: "get"
        })

        return data
    }

    async getUser() {
        // GET /face-swap/limits

        /* Production
        const data = await request('/face-swap/limits', "GET")
        return data
        */

        // DEMO
        return { limit: 1, extraGenerationAvailable: false }
        return { limit: 0,  "result": "https://xx10.ru/photo/images/M/10newyear/16.jpeg", "textphoto": "Я в полном восторге от своего преображения! Мне помог - https://vk.com/app51722498"}
    }


    async setUser() {
        // PUT /face-swap/limits 
        // срабатывает посли подписок, ожидается что пользователь получит 1 гереацию 

         /* Production
        const data = await request('/face-swap/limits', "PUT")
        return data
        */

        // DEMO
        return true
    }

    async uploadPhoto(photo, uploadUrl) {
        // photo => https://xx10.ru/photo/images/M/10newyear/16.jpeg (Результат поселдней обработки полученый из getUser "result")
        // uploadUrl => url на который необходимо отправить файл

         /* Production
        const data = await request('https://mydomine.com/upload_photo', "POST", {
            photo, 
            uploadUrl
        })
        return data
        */

        // DEMO
        return {
            server: 'string',
            photos_list: 'array',
            hash: 'string'
        }
    }

    async generate(img, photo) {
        // img => type Blob
        // POST /face-swap/generate

        /* Production
        const data = await request('https://mydomine.com/face-swap/generate', "POST", {
            file1: img,
            image_id: photo.id
        }, { 'Content-Type': 'multipart/form-data' })

        return data
        */
        
        // Demo
        //throw new Error("Тест")
        return { 
            arr: [189770961, 189770962, 189770963],
            gr: 'https://vk.com/app' + window.process.APP_ID,  
            result: "https://xx10.ru/photo/images/M/10newyear/16.jpeg",
            textphoto: "Я в полном восторге от своего преображения! Мне помог - https://vk.com/app51722498",
            textcaption: "Я в полном восторге от своего преображения! Мне помог - https://vk.com/app51722498"
        }
    }
}

export default new API()