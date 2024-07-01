"""update profile

Revision ID: fe5bf52c0842
Revises: 80421f6350f6
Create Date: 2024-06-30 20:51:52.227254

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'fe5bf52c0842'
down_revision = '80421f6350f6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('profile', schema=None) as batch_op:
        batch_op.alter_column('foto',
               existing_type=mysql.VARCHAR(length=256),
               type_=sa.Text(),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('profile', schema=None) as batch_op:
        batch_op.alter_column('foto',
               existing_type=sa.Text(),
               type_=mysql.VARCHAR(length=256),
               existing_nullable=False)

    # ### end Alembic commands ###