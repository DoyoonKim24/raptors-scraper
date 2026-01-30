def compare_rows(row1, row2):
    def get_row_value(row):
        if isinstance(row, str) and row.isalpha():
            return ord(row.upper()) - 64
        elif row.isdigit():
            return int(row) + 100
    val1 = get_row_value(row1)
    val2 = get_row_value(row2)
    return val1 - val2
