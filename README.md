# flumelog-level

a flumelog implemented on top of leveldb.

Use as the append-only store within [flumedb](https://github.com/flumedb/flumedb)

leveldb is a Log Structured Merge Tree,
so using it just as a log is rather silly,
but as a matter of ensuring a broad base of compatible backend,
and to explore the problem space...

And also to compare performance. If you had built a complex leveldb app,
you might already have a log inside of it.
This enables us to do comparative performance between implementations.

## License

MIT
