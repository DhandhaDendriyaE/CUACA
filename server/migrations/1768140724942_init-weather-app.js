exports.up = (pgm) => {
  // Tabel admins
  pgm.createTable('admins', {
    id: 'id',
    email: { type: 'VARCHAR(100)', notNull: true, unique: true },
    password_hash: { type: 'TEXT', notNull: true },
    created_at: { type: 'TIMESTAMPTZ', default: pgm.func('NOW()'), notNull: true }
  });
  pgm.createIndex('admins', ['email']);

  // Tabel pengunjung
  pgm.createTable('pengunjung', {
    id: 'id',
    name: { type: 'VARCHAR(100)', notNull: true },
    email: { type: 'VARCHAR(100)', notNull: true, unique: true },
    password_hash: { type: 'TEXT', notNull: true },
    created_at: { type: 'TIMESTAMPTZ', default: pgm.func('NOW()'), notNull: true }
  });
  pgm.createIndex('pengunjung', ['email']);

  // Tabel weather_records
  pgm.createTable('weather_records', {
    id: 'id',
    city: { type: 'VARCHAR(100)', notNull: true },
    country: { type: 'VARCHAR(100)' },
    date: { type: 'DATE', notNull: true },
    period: { type: 'VARCHAR(20)', notNull: true },
    temperature_c: 'DOUBLE PRECISION',
    humidity_percent: 'DOUBLE PRECISION',
    precipitation_mm: 'DOUBLE PRECISION',
    wind_kph: 'DOUBLE PRECISION',
    pressure_mb: 'DOUBLE PRECISION',
    condition_text: 'TEXT',
    icon_url: 'TEXT',
    fetched_at: {
      type: 'TIMESTAMPTZ',
      default: pgm.func('NOW()'),
      notNull: true,
    },
  });

  pgm.addConstraint('weather_records', 'unique_city_date_period', {
    unique: ['city', 'date', 'period'],
  });
  pgm.createIndex('weather_records', ['city', 'date']);
};

exports.down = (pgm) => {
  pgm.dropTable('weather_records');
  pgm.dropTable('pengunjung');
  pgm.dropTable('admins');
};