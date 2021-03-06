# Supported Object/Variation

Object | Variation | Descripcion
-------|-----------|------------
1      | 1         | Single-bit binary input
1      | 2         | Binary input with status
2      | 1         | Binary input change without time
2      | 2         | Binary input change with time
2      | 3         | Binary input change with relative time
10     | 1         | Single-bit binary output state
10     | 2         | Binary output state with status
12     | 1         | Control relay output block
20     | 1, 2      | 32-bit, 16-bit counter
20     | 3, 4      | 32-bit, 16-bit delta counter
20     | 5, 6      | 32-bit, 16-bit counter without flags
20     | 7, 8      | 32-bit, 16-bit delta counter without flags
21     | 1, 2      | 32-bit, 16-bit frozen counter
21     | 3, 4      | 32-bit, 16-bit frozen delta counter
21     | 5, 6      | 32-bit, 16-bit frozen counter with time of freeze
21     | 7, 8      | 32-bit, 16-bit frozen delta counter with time of freeze
21     | 9, 10     | 32-bit, 16-bit frozen counter without flags
21     | 11, 12    | 32-bit, 16-bit frozen delta counter without flags
30     | 1, 2      | 32-bit, 16-bit analog input
30     | 3, 4      | 32-bit, 16-bit analog input without flags
30     | 5, 6      | 32-bit, 64-bit floating input with flags
31     | 1, 2      | 32-bit, 16-bit frozen analog input with flags
31     | 3, 4      | 32-bit, 16-bit frozen analog input with time of freeze
31     | 5, 6      | 32-bit, 16-bit frozen analog input without flags
31     | 7, 8      | 32-bit, 64-bit floating frozen input with flags
32     | 1, 2      | 32-bit, 16-bit analog change event without time
32     | 3, 4      | 32-bit, 16-bit analog change event with time
32     | 5, 6      | 32-bit, 64-bit floating change event with flags
32     | 7, 8      | 32-bit, 64-bit floating change event with time
33     | 1, 2      | 32-bit, 16-bit frozen analog change event without time
33     | 3, 4      | 32-bit, 16-bit frozen analog change event with time
33     | 5, 6      | 32-bit, 64-bit floating frozen change event with flags
33     | 7, 8      | 32-bit, 64-bit floating frozen change event with time
40     | 1, 2      | 32-bit, 16-bit analog output status
40     | 3, 4      | 32-bit, 64-bit floating output with flags
50     | 1         | Time and date
50     | 2         | Time and date with interval
50     | 3         | Last recorded time
51     | 1         | Time and date CTO
