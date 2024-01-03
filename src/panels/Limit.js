import { Button, Panel } from "@vkontakte/vkui";
import { wallPost } from "../utils/utils";
import { useState } from "react";

export default function Limit({ id, user }) {
    const [loading, setLoading] = useState(false)

    const fetchPost = async () => {
        setLoading(true)
        try {
            await wallPost(user.data.textphoto , user.data.result)
        } catch (e) {
            console.error(e);
        }
        setLoading(false)
    }


    return <Panel id={id} style={{ minHeight: '100vh'}}>
        <div className="InitMenu">
            <img src={user.data.result}/>
            <h1>К сожалению, на сегодня ваш лимит на образы исчерпан. Пожалуйста, заходите завтра</h1>
            <Button 
                size="l"
                loading={loading}
                className="DefaultButton"
                onClick={fetchPost}
            >
                Поделиться с друзьями
            </Button>
        </div>
    </Panel>
}