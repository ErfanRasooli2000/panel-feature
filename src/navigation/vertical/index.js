/*

Array of object

Top level object can be:
1. Header
2. Group (Group can have navItems as children)
3. navItem

* Supported Options

/--- Header ---/

header

/--- nav Grp ---/

title
icon (if it's on top level)
tag
tagVariant
children

/--- nav Item ---/

icon (if it's on top level)
title
route: [route_obj/route_name] (I have to resolve name somehow from the route obj)
tag
tagVariant

*/
import artist from '@/navigation/vertical/artists'
import albums from '@/navigation/vertical/albums'
import songs from '@/navigation/vertical/songs'

// Array of sections
export default [
    ...artist,
    ...albums,
    ...songs,
]
