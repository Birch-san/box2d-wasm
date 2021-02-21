// https://github.com/Microsoft/vscode-cpptools/issues/1083
// the Visual Studio Code C/C++ Extension cannot parse .cpp/.h
// files which attempt #include <algorithm>, due to platform-specific error:
//   cannot open source file "Availability.h" (dependency of "algorithm")
// .vscode/c_cpp_properties.json references this file as a forcedInclude
// to opt-out of platform-specific treatment.
// in any case, our target platform is WebAssembly rather than native,
// so 
#undef __linux__
#undef __x86_64__
#undef __APPLE__
#undef __WIN32