#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <istream>

using namespace std;

// balloon
int main() {
    // infile
    ifstream inFile;
    int num_dirs;
    string num;
    cin >> num_dirs;
    if (num_dirs < 10) {
        num = "00" + to_string(num_dirs);
    } else if (num_dirs < 100) {
        num = "0" + to_string(num_dirs);
    } else {
        num = to_string(num_dirs);
    }
    string fileName = string("geodesic/") +  num + string(".obj");
    inFile.open(fileName);

    string v;
    float x, y, z;
    ofstream outFile;
    outFile.open("output.txt");
    outFile << "float num_geodesic = " << num_dirs << ".0;" << endl;
    outFile << "vec3 geodesic[" << num_dirs << "];" << endl;
    for (int i = 0; i < num_dirs; ++i) {
        inFile >> v >> x >> y >> z;
        outFile << "geodesic[" << i << "] = vec3(" << x << ", " << y << ", " << z << ");" << endl;
    }
    inFile.close();
    outFile.close();
}