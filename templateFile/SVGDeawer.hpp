#include<string>
#include<iostream>

namespace svg{
    class SVGDrawer{
        private:
        
        std::string result;

        std::string LineColor;
        std::string FillColor;
        float LineWidth;

        public:

        SVGDrawer(int width, int height, std::string backgroundColor, int vbminX = 0, int vbminY = 0, int vbmaxX = -1, int vbmaxY = -1){
            if(vbmaxX == -1)vbmaxX = width;
            if(vbmaxY == -1)vbmaxY = height;
            this->result = "<svg xmlns=\"http://www.w3.org/2000/svg\" id=\"vis\" width=\""
            + std::to_string(width) + "\" height=\"" + std::to_string(height) + 
            "\" viewBox=\"" + std::to_string(vbminX) + " " + std::to_string(vbminY) + " " + std::to_string(vbmaxX) +" "+ std::to_string(vbmaxY)
            + "\">\n";

            LineColor = "#000000";
            FillColor = "#777777";
            LineWidth = 3;
        }

        void ChangeLineWidth(float lineWidth) {LineWidth = lineWidth;}
        void ChangeLineColor(std::string lineColor) {LineColor = lineColor;}
        void ChangeFillColor(std::string fillColor) {FillColor = fillColor;}

        void DrawLine(float startX, float startY, float endX, float endY, float lineWidth = -1, std::string lineColor = ""){
            if(lineWidth == -1)lineWidth = LineWidth;
            if(lineColor == "")lineColor = LineColor;
            result += "<line x1=\"" + std::to_string(startX) + "\" y1=\"" +  std::to_string(startY) + 
            "\" x2=\"" + std::to_string(endX) + "\" y2=\"" +  std::to_string(endY) + 
            "\" stroke=\"" + lineColor + "\" stroke-width=\"" + std::to_string(lineWidth) + 
            "\"/> \n";
        }

        void DrawRect(float x ,float y ,float width, float height, float rx = 0, float ry = 0){

        }

        void DrawCircle(float centerX, float centerY, float Radius){
            
        }

        void DrawPolygon(){}

        std::string Print_SVG(){
            return result+"</svg>";
        } 
    };
};

#include<iostream>

int main(){

    svg::SVGDrawer drawer(500, 500, "ffffff", -5, -5, 505, 505);
    drawer.DrawLine(0,0,500,500);
    std::cout << drawer.Print_SVG() << std::endl;
}