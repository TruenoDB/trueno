###A few examples

#### List all graphs
```
list
```

#### List vertex
```
list -v
```

#### List edges
```
list -e
```

#### List edges from vertex 1
```
list -e 1
```

#### Add a vertex with id `1` to graph `test`
```
add vertex test -n 1 -a '{"label" : value}'
```

#### Update edge `(1,3)` from graph `test`
```
update edge test -t 1 -f 3 -a '{"label" : "value", "number" : 30}'
```

#### delete vertex with id `1` to graph `test`
```
delete vertex test -n 1 
```
