import { Button, Panel } from '@vkontakte/vkui';
import { Icon20ErrorCircle } from '@vkontakte/icons';

export default function ErrorPanel({ id, go }) {
  return (
    <Panel id={id} style={{ minHeight: '100vh' }}>
      <div className="InitMenu">
        <Icon20ErrorCircle
          width={150}
          height={150}
          style={{ marginBottom: '30px' }}
        />
        <h1>Ошибка! Попробуйте еще раз</h1>
        <Button
          style={{ marginTop: '10px' }}
          onClick={go}
          data-to="init"
          size="l"
          className="DefaultButton"
        >
          Выбрать другой образ
        </Button>
      </div>
    </Panel>
  );
}
