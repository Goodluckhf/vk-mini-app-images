const request = async (url, method = 'GET', body = null, headers = {}) => {
    try {
        if (method === 'POST') {
          if (!body) {
            body = {
              url: window.location.search
            }
          } else {
            body.url = window.location.search
          }
        }
        
        if (body) {
          body = JSON.stringify(body)
          if (!headers['Content-Type']) headers['Content-Type'] = 'application/json'
        }
        
        const responce = await fetch(url, { method, body, headers })    
        const data = await responce.json()    
        if (!responce.ok) {
          throw new Error(data.message || 'Что-то пошло не так')
        } 
        return data
    } catch (e) {
        throw e
    }
}
export default request