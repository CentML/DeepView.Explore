import argparse
import dominate
from dominate.tags import *
import os
from datetime import datetime

'''
This is a script to build the index.html for the S3 instance. 
Note that this file has to be run in the same directory as the VSIX files.
'''

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("title", type=str)
    parser.add_argument('-f', '--file-list', nargs='+', default=[])

    args = parser.parse_args()

    doc_title = args.title
    file_list = args.file_list
    doc = dominate.document(title=doc_title)

    with doc:
        h1(doc_title)
        file_table = table()
        table_head = thead()
        header_row = tr()
        header_row += th("File name")
        header_row += th("Date Updated")
        table_head += header_row
        file_table.add(table_head)

        table_body = tbody()
        for file in file_list:
                row = tr()
                row += td(a(file, href=file))
                last_modified_time = os.path.getmtime(file)
                row += td(datetime.fromtimestamp(last_modified_time).isoformat())
                table_body += row
        file_table.add(table_body)
    with open("index.html", "w") as file:
        file.write(doc.render())
