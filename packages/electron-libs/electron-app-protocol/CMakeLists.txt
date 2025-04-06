# set a minumum version of cmake
cmake_minimum_required(VERSION 3.31.2)

# name of the project
project(cpp_addon_example
    VERSION 1.0.0
    DESCRIPTION "A simple cpp addon example project"
    LANGUAGES C CXX
)

set(CMAKE_CXX_STANDARD 17)

add_definitions(-DNAPI_VERSION=9)
include_directories(${CMAKE_JS_INC} "addons")

# disallow in-source builds
if(${CMAKE_SOURCE_DIR} STREQUAL ${CMAKE_BINARY_DIR})
    message(FATAL_ERROR "In-source builds not allowed. Make sure you run `build.sh` script.")
endif()

# node js addon
if(WIN32)
    set(OS "windows")
elseif(UNIX AND NOT APPLE)
    set(OS "linux")
elseif(APPLE)
    set(OS "mac")
else()
    message(FATAL_ERROR "Unsupported operating system")
endif()

file(GLOB SOURCE_FILES "src/native/${OS}/*" "src/native/core/*")

add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})

# Link necessary macOS frameworks if on macOS
if(APPLE)
    target_link_libraries(${PROJECT_NAME} PRIVATE
        "-framework CoreFoundation"
        "-framework Foundation"
        "-framework ApplicationServices"
    )
endif()

add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy
    $<TARGET_FILE:${PROJECT_NAME}>
    ${CMAKE_SOURCE_DIR}/build/${PROJECT_NAME}.node
    COMMENT "Copying to output directory"
)
