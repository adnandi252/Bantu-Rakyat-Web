"""update table

Revision ID: e22ee4a28b8a
Revises: 842231b111a1
Create Date: 2024-05-31 14:25:22.734049

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e22ee4a28b8a'
down_revision = '842231b111a1'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('jadwal_penyaluran', schema=None) as batch_op:
        batch_op.drop_constraint('jadwal_penyaluran_ibfk_1', type_='foreignkey')
        batch_op.create_foreign_key(None, 'penerima_manfaat', ['penerimaManfaatId'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('penerima_manfaat', schema=None) as batch_op:
        batch_op.drop_constraint('penerima_manfaat_ibfk_1', type_='foreignkey')
        batch_op.drop_constraint('penerima_manfaat_ibfk_2', type_='foreignkey')
        batch_op.create_foreign_key(None, 'jenis_bantuan', ['jenisBantuanId'], ['id'], ondelete='CASCADE')
        batch_op.create_foreign_key(None, 'user', ['userId'], ['id'], ondelete='CASCADE')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('penerima_manfaat', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('penerima_manfaat_ibfk_2', 'user', ['userId'], ['id'])
        batch_op.create_foreign_key('penerima_manfaat_ibfk_1', 'jenis_bantuan', ['jenisBantuanId'], ['id'])

    with op.batch_alter_table('jadwal_penyaluran', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.create_foreign_key('jadwal_penyaluran_ibfk_1', 'penerima_manfaat', ['penerimaManfaatId'], ['id'])

    # ### end Alembic commands ###