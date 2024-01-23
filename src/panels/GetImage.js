import { Panel, File } from "@vkontakte/vkui";
import { Icon24Camera } from "@vkontakte/icons"
import { Icon20StoryFillCircleRed } from "@vkontakte/icons"

export default function GetImage({ id, go, setAva }) {

    const getPhoto = (e) => {
        setAva(e.target.files[0])
        go('generate')
    }

    return <Panel id={id} style={{ minHeight: '100vh' }}>
        <div className="InitMenu">
            <Icon20StoryFillCircleRed width={150} height={150} style={{ marginBottom: '30px'}}/>
            <h1>Мы не смогли определить Ваше лицо на аватарке! Попробуйте использовать другое фото с галереи, либо обновите аватар на Вашей странице и возвращайтесь снова. Внимание! На фото должно быть 1 лицо в хорошем качестве</h1>

            <File 
                className="DefaultButton" 
                before={<Icon24Camera role="presentation" />} 
                accept="image/png, image/gif, image/jpeg"
                size="m"
                onChange={getPhoto}
            >
                Открыть галерею
            </File>
        </div>
    </Panel>
}