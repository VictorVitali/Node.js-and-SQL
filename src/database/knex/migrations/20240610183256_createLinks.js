
exports.up = knex => knex.schema.createTable("links", table => {
    table.increments("id");

    table.integer("note_id").references("id").inTable("notes").onDelete("CASCADE");
    table.timestamp("created_at").default(knex.fn.now());
    table.text("url").notNullable();
});

exports.down = knex => knex.schema.dropTable("links");

