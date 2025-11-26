"""add unique constraint and index on phone_number

Revision ID: ca742503fb77
Revises: 2c21a328e6a9
Create Date: 2025-11-22 23:29:01.984224

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ca742503fb77'
down_revision: Union[str, Sequence[str], None] = '2c21a328e6a9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_index("ix_users_phone_number", "users", ["phone_number"], unique=True)
    

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index("ix_users_phone_number", table_name="users")
