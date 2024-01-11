import { Button, ButtonGroup, Panel, ScreenSpinner, Spinner } from "@vkontakte/vkui";
import { useEffect } from "react";
import useState from 'react-usestateref'
import { Icon28Hearts2CircleFillTwilight, Icon28StoryCircleFillViolet, Icon201CircleFillGold } from "@vkontakte/icons"
import { shareHistory, showAds, wallPost } from "../utils/utils";
import bridge from "@vkontakte/vk-bridge";
import api from "../utils/api";
import img1 from '../img/subscribe.png'
import ErrorPanel from "./Error";
import {LimitError, FaceNotFound, UnknownError} from '../utils/exceptions'
function Subscribe({ setPanel, user, result}) {
    const [loading, setLoading] = useState(false)
    const getPoints = async () => {
        let status = 0
        setLoading(true)
        const groups = result.groupids

        for (let i = 0; i < groups.length; i++) {
            const group_id = groups[i];
            try {
                let data = await bridge.send('VKWebAppJoinGroup', {
                    group_id
                })
                if (data.result) status++
            } catch (e) {
                console.error(e);
            }
        }

        setLoading(false)
        if (status) {
            api.setUser(user.id)
            setPanel("Share")
        }
    }

    if (user.data.extraGenerationAvailable) return <div className="InitMenu">
        <Icon201CircleFillGold width={150} height={150} style={{ marginBottom: '30px'}}/>
        <h1>Подпишитесь на нас. Получите дополнительную генерацию.</h1>
        <ButtonGroup mode="vertical">
            <Button 
                onClick={getPoints}
                loading={loading}
                size="l" 
                className="DefaultButton"
            >
                Подписаться +1 генерация
            </Button>
            <Button 
                size="l"
                onClick={async () => {
                    await showAds();
                    setPanel("Share")
                }}
                appearance="accent" 
                mode="secondary" 
                stretched
            >
                Пропустить
            </Button>
        </ButtonGroup>
    </div>


    return <div className="InitMenu">
        <img src={img1}/>
        <h1>Подпишитесь на нас. Следите за новостями. Будьте в курсе всех событий.</h1>
        <ButtonGroup mode="vertical" style={{ minWidth: '250px'}}>
            <Button 
                onClick={getPoints}
                loading={loading}
                size="l" 
                stretched
                className="DefaultButton"
            >
                Подписаться
            </Button>
            <Button 
                size="l"
                onClick={async () => {
                    await showAds();
                    setPanel("Share")
                }}
                appearance="accent" 
                mode="secondary" 
                stretched
            >
                Пропустить
            </Button>
        </ButtonGroup>
    </div> 
}

function Share({ setPanel, result }) {

    const share = async () => {
        try {
            await wallPost(result.textphoto , result.path)
            setPanel("History")
        } catch (e) {
            console.error(e);
        }
    }

    return <div className="InitMenu">
        <Icon28Hearts2CircleFillTwilight width={150} height={150} style={{ marginBottom: '30px'}}/>
        <h1>Опубликуйте результат. Это возможность получить много лайков от друзей.</h1>
        <ButtonGroup mode="vertical">
            <Button size="l" className="DefaultButton" onClick={share}>Опубликовать результат</Button>
            <Button 
                size="l"
                onClick={async () => {
                    await showAds()
                    setPanel("History")
                }}
                appearance="accent" 
                mode="secondary" 
                stretched
            >
                Пропустить
            </Button>
        </ButtonGroup>
    </div>
}

function History({ setPanel, result }) {
    const share = async () => {
        try {
            await shareHistory(result.result)
            setPanel("Result")
        } catch (e) {
            console.error(e);
        }
    }

    return <div className="InitMenu">
        <Icon28StoryCircleFillViolet width={150} height={150} style={{ marginBottom: '30px'}}/>
        <h1>Опубликуйте историю. Это возможность получить много реакций от друзей.</h1>
        <ButtonGroup mode="vertical">
            <Button size="l" className="DefaultButton" onClick={share}>Опубликовать историю</Button>
            <Button 
                size="l"
                onClick={async () => {
                    await showAds()
                    setPanel("Result")
                }}
                appearance="accent" 
                mode="secondary" 
                stretched
            >
                Пропустить
            </Button>
        </ButtonGroup>
    </div>
}

function Result({ result, setPanel, go}) {
    const share = async () => {
        try {
            await wallPost(result.textphoto , result.result)
            setPanel("History")
        } catch (e) {
            console.error(e);
        }
    }

    return <div className="InitMenu">
        <img src={result.result} style={{ width: '250px'}}/>
        <h1>Ваш результат готов. Не забудьте показать результат друзьям.</h1>

        <Button 
            onClick={share} 
            size="l" 
            className="DefaultButton"
        >
            Поделиться с друзьями
        </Button>
        <Button 
            style={{ marginTop: '10px'}}
            onClick={go} 
            data-to="init"
            size="l" 
            className="DefaultButton"
        >
            Выбрать другой образ
        </Button>
        
    </div>
}

const panels = { Subscribe, Share, History, Result, ErrorPanel}

export default function Generate({ id, photo, go, ava, user }) {
    const [loading, setLoading] = useState(true)
    const [panel, setPanel] = useState(null)
    const [result, setResult] = useState(null)
    const ActivePanel = panels[panel]

    useEffect(() => {
        const poll = async (id) => {
            try{
                const job = await api.getResult(id)
                    
                if(job == 'PENDING'){
                    return setTimeout(poll, 3_000, id)
                }
    
                const image = api.getImage(job.result)
                setPanel('Subscribe')
                setResult({...job, path: job.result, result: image});
                setLoading(false)
            }
            catch(e){
                if(e instanceof FaceNotFound){
                    go('get_image')
                }
                else{
                    go('error_panel')
                }
            }
        }

        const start = async () => {
            try{
                const id = await api.generate(user.id, ava, photo)
                poll(id)
            }
            catch(e){
                if(e instanceof LimitError){
                    go('limit')
                }
                else {
                    go('error_panel')
                }
            }
        }

        start()
    }, [])

    if (loading) return <>
     <div className="InitMenu">
        <h1 class="loading-text" style={{ marginBottom: '200px'}}>Идет обработка... Пожалуйста, подождите</h1>
        <ScreenSpinner/>
     </div>
    </>

    return <Panel id={id}>
        <ActivePanel setPanel={setPanel} result={result} user={user} go={go}/>
    </Panel>
}