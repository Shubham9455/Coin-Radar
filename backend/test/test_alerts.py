import pytest
from app.db.models.alerts import Alerts
from test.test_main import client
from test.test_config import override_config, override_get_db




@pytest.fixture
def db():
    return next(override_get_db())


@pytest.fixture
def test_alert(db):
    alert = Alerts(
        user_id=1,
        symbol="BTCUSD",
        is_active=True,
        note="Test Alert",
        upper_trigger=50000.0,
        lower_trigger=30000.0,
        current_condition="between",
        source="binance"
    )
    db.add(alert)
    db.commit()
    yield alert
    db.delete(alert)
    db.commit()


def test_create_alert_all(test_alert): 
    test_resp = client.get("/alerts/")
    print(test_resp.json())
    assert test_resp.status_code == 200
    assert len(test_resp.json()) >= 1
    assert test_resp.json()[0] == {
        "id": test_alert.id,
        "user_id": test_alert.user_id,
        "symbol": test_alert.symbol,
        "is_active": test_alert.is_active,
        "note": test_alert.note,
        "upper_trigger": test_alert.upper_trigger,
        "lower_trigger": test_alert.lower_trigger,
        "current_condition": test_alert.current_condition,
        "source": test_alert.source,
        "created_at": test_alert.created_at.isoformat(),
        "last_triggered": test_alert.last_triggered.isoformat() if test_alert.last_triggered else None
    }


