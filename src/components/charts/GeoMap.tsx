import React, { useState } from 'react';

interface GeoMapDataPoint {
  city: string;
  zipCode: string;
  coordinates: [number, number]; // [longitude, latitude]
  riskLevel: 'critical' | 'medium' | 'low';
  utilizationVelocity: number;
  exposureM: number;
  avgCLTV: number;
  hpiChange: number;
  primeCount: number;
}

interface GeoMapProps {
  data: GeoMapDataPoint[];
  config?: {
    mapConfig?: {
      markerColors?: {
        critical?: string;
        medium?: string;
        low?: string;
      };
    };
  };
  onCityClick?: (city: string) => void;
}

const GeoMap: React.FC<GeoMapProps> = ({ data, config, onCityClick }) => {
  const defaultColors = {
    critical: '#dc2626',
    medium: '#f59e0b',
    low: '#10b981'
  };

  const colors = {
    ...defaultColors,
    ...config?.mapConfig?.markerColors
  };

  const [hoveredCity, setHoveredCity] = useState<GeoMapDataPoint | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Geographically accurate Texas based on actual GeoJSON state boundaries
  // Key features: rectangular Panhandle, Big Bend curves, nearly square aspect ratio (1:0.81), angular borders
  // Generated from official Texas GeoJSON data with proper coordinate transformation
  // ViewBox: 1000 x 812.5 (matching Texas's ~801mi x 773mi dimensions)
  const texasPath = `M 747.9,640.3 L 748.9,639.7 L 749.4,638.5 L 748.7,636.4 L 748.8,635.7 L 750.8,634.5 L 757.5,633.7 L 757.6,632.8 L 758.8,632.2 L 760.8,631.4 L 761.5,629.7 L 764.9,627.5 L 764.7,627.3 L 766.9,625.8 L 769.5,625.5 L 770.9,624.3 L 776.8,623.1 L 779.3,621.8 L 779.4,620.9 L 780.5,620.5 L 780.9,622.7 L 777.8,624.5 L 763.8,631.3 L 753.4,638.4 L 746.1,644.2 L 737.5,652.7 L 732.5,658.8 L 731.5,661.3 L 728.4,664.7 L 722.2,673.6 L 718,681.2 L 711.7,694.1 L 708.4,704 L 707.2,709.2 L 706.2,717.5 L 706.1,725.8 L 707.1,735 L 709.5,745.3 L 713,755.7 L 714.4,759.3 L 717.9,770.1 L 720.8,781.2 L 722.6,794.8 L 722.6,796.4 L 721.8,793.7 L 721.3,788 L 720.1,780.8 L 717.6,772.1 L 716.6,770.1 L 716,766.7 L 714.9,764.7 L 712.6,761.2 L 711.4,757.9 L 710.7,755.9 L 710.1,754.8 L 709.3,750.7 L 707.2,747.3 L 706.6,745.3 L 707.1,743.6 L 706.8,742.4 L 706.8,740.8 L 705.4,738.9 L 705.5,733.7 L 705.2,729.3 L 705.2,720.1 L 705.4,718.3 L 705.2,713.3 L 705.9,709.7 L 705.8,707.7 L 706.4,704.1 L 706.9,702.4 L 707.5,702 L 707.3,700.3 L 707.3,697.7 L 709.3,694.5 L 709.8,693.3 L 709.8,692.1 L 712.5,687.3 L 714.6,683.8 L 715,682.2 L 715.7,681 L 716,680.8 L 716.5,679.2 L 717.3,676.9 L 718.2,677.1 L 719.6,675.6 L 719.9,673.4 L 719.4,672.7 L 721.9,670.2 L 722.6,669.2 L 723.7,669.1 L 725.2,667.5 L 727.1,665 L 727.4,663.5 L 727.9,662.7 L 725.3,662.6 L 724.7,662.2 L 730.6,660.9 L 731.6,659.6 L 733.6,655.6 L 736,652.4 L 736.6,650.5 L 736,650.7 L 736.6,648.7 L 737.5,647.3 L 737.8,647.9 L 739,646.9 L 740.6,645.6 L 740.5,644.5 L 743.3,643 L 743.5,642.3 L 743.6,639.9 L 744.5,638.7 L 745.3,639.2 L 746.7,640.6 L 747.9,640.3 Z M 505.9,133.9 L 505.9,148.1 L 509.4,146.7 L 511.8,147 L 515.5,149.9 L 516.2,150.9 L 521.7,156.2 L 529.2,162 L 535.2,162.2 L 538.4,158.9 L 544.1,159.6 L 547.7,161.2 L 551.2,162.4 L 555,157.1 L 566.1,165.1 L 566.3,166.1 L 566.1,168.6 L 570.3,175 L 577.7,175.2 L 585.9,175.9 L 593.1,179.2 L 605.2,180.5 L 608.8,178.6 L 612,178.6 L 614.5,179.5 L 620.1,185.3 L 625.5,183.5 L 628.2,181.1 L 630.8,178.9 L 635.7,180.6 L 643.3,182 L 650.5,188.3 L 652.1,190.6 L 657.1,191.3 L 662.7,191.6 L 660.3,199.3 L 661.1,199.9 L 668.8,202.4 L 675,199.2 L 681.5,193 L 682.4,191.9 L 684.8,191.7 L 689.9,194.4 L 689.4,197.1 L 690.1,198.3 L 692.1,198.7 L 693.3,198.5 L 696.7,197 L 698,197.3 L 700.5,199.2 L 700,201.9 L 699.6,202.9 L 700.4,204 L 702.4,204.7 L 711.2,200.6 L 718.8,197.3 L 721.1,198.9 L 722.2,203.1 L 721.1,203.7 L 719.7,204 L 719.3,206.1 L 722.5,211.5 L 723.4,212 L 725.7,212.5 L 727.5,211.6 L 731.3,204.8 L 736,199.5 L 739.2,194.8 L 740.9,194 L 742,194.7 L 742.9,198.8 L 745.1,202.1 L 753.1,204.3 L 757.3,203.4 L 758.2,202.3 L 759,200.6 L 759.5,199.1 L 761,198.5 L 762.9,199.3 L 764.3,199.9 L 764.6,200.4 L 764.3,202.1 L 764.5,203.5 L 777.1,207.6 L 779,207.9 L 783.1,212.5 L 793.7,210.1 L 796,209.8 L 798.3,208.5 L 799.3,205.1 L 803.8,202.5 L 823,203 L 829.3,202.5 L 841.8,195.9 L 844.9,196.2 L 845.7,198.4 L 845.5,199.4 L 846.1,200 L 856.5,201.1 L 863.9,200.7 L 867.7,199.4 L 868.5,198.3 L 868.5,196.8 L 868.3,195.9 L 870.3,193.8 L 875.7,195.1 L 882.5,197.2 L 882.9,198.2 L 897.6,210.3 L 905.9,211.7 L 907.8,214.4 L 923.6,220.2 L 926.5,219.4 L 926.9,218.5 L 928,220.9 L 932.7,223.8 L 944.3,222.7 L 950.1,221.9 L 958.8,223.8 L 960.6,225.1 L 960.7,229.6 L 960.6,231.3 L 960.7,234.3 L 960.7,238.4 L 960.7,239.8 L 960.7,240.7 L 960.7,246.5 L 960.7,247.3 L 960.7,248.7 L 960.7,251.7 L 960.6,256.3 L 960.7,257 L 960.7,261.1 L 960.7,270.6 L 960.7,274.1 L 960.7,275.4 L 960.7,276.3 L 960.7,277 L 960.7,283.5 L 960.7,284 L 960.7,284.9 L 960.6,290.6 L 960.7,294.4 L 960.7,296.1 L 960.7,297 L 960.6,300.8 L 960.7,305 L 960.7,306.4 L 960.7,306.9 L 960.7,307.4 L 960.7,307.6 L 960.7,310.3 L 960.7,313 L 960.7,315 L 960.7,323 L 960.7,326.9 L 960.7,330.8 L 960.7,331.5 L 960.7,334.4 L 960.7,343.6 L 965.8,349.4 L 970,352 L 973.2,355.4 L 978.3,365.3 L 977.2,372.9 L 976.5,375.1 L 979.4,379.1 L 987.2,388.6 L 991.4,391.4 L 991.1,398.7 L 993.4,400 L 993.9,404.2 L 994.5,406.4 L 995.4,407.2 L 998.1,405.7 L 998.4,405.6 L 999.7,406.1 L 999,419.3 L 997.9,429.2 L 997.6,429.8 L 997.3,433.7 L 984.7,452.4 L 986.1,457.6 L 987,462.7 L 983.7,465.4 L 982.4,466.4 L 984.1,473.3 L 985.3,473.6 L 985.9,481.4 L 987.2,485.8 L 985.2,492.2 L 982.9,495 L 980,497.1 L 972.3,508.2 L 972.2,514.1 L 975.2,520.9 L 972.3,521.1 L 963.8,520.5 L 953.8,523.2 L 935.6,530.2 L 918.5,536.8 L 912.8,539.7 L 909.9,541.8 L 908.1,544.4 L 905.8,544.9 L 904.2,544.7 L 905.4,542.5 L 908.7,540 L 911.5,536.9 L 912.6,536.1 L 913.8,536.1 L 916,536.2 L 918.6,535 L 918.8,533.3 L 920.7,531.9 L 922.2,532.5 L 924.9,532.9 L 925.5,531.1 L 924.9,531.1 L 924,530.9 L 923.3,529.9 L 922.5,529.1 L 921.7,528.7 L 920.4,528.9 L 919.8,529.2 L 917.4,530 L 916.5,530.3 L 916.2,530.3 L 911.3,531.5 L 909.1,531.8 L 906.3,532.5 L 906.1,532.5 L 905.4,532.4 L 905.2,532.4 L 905.1,532.3 L 904.8,532.2 L 904.4,532 L 904.3,532 L 904.1,531.6 L 903.9,531.2 L 903.6,530.7 L 905.1,530.7 L 907.9,528 L 911,519.5 L 910.9,517.3 L 907.8,512.6 L 905,513.5 L 901.6,514.8 L 897.9,519.5 L 897.3,521.3 L 894.1,522.4 L 892.9,521.1 L 892.5,519.7 L 890.2,519.1 L 888.5,521.2 L 887.2,522.2 L 887,522.5 L 886.7,522.9 L 886.6,523.4 L 886.4,523.7 L 886.6,524.5 L 887.5,525.3 L 887.6,525.3 L 888.5,526 L 888.9,526.6 L 888.9,526.7 L 888.4,527.4 L 886.4,529.8 L 886.3,529.9 L 886.2,530.2 L 886.2,530.2 L 886.5,531.3 L 887.6,532.8 L 890.8,534 L 892.7,534.3 L 894.5,534.6 L 894.2,535.3 L 892.9,538.2 L 895.9,539.5 L 896.3,544.6 L 895.7,549 L 897.1,550.2 L 899.1,549.8 L 901.2,548 L 902.1,545.6 L 904.4,547 L 907,547 L 908.1,546.7 L 908.1,547.2 L 903.9,550.3 L 885.6,561.2 L 879.2,565.8 L 878.3,566.9 L 873,570.8 L 866.8,575.5 L 864,578 L 858.8,582 L 855.8,583.3 L 850.5,585 L 844.2,588.6 L 820.1,600.5 L 805.3,606.4 L 794.5,611.3 L 790.6,613.6 L 786.7,616.4 L 785.2,617 L 782.9,618.8 L 782.4,619.6 L 782.1,618.9 L 782.7,618 L 790.8,612.4 L 794.6,610.7 L 800.2,607.3 L 807.7,604.1 L 810.7,603.1 L 812.6,602 L 812.6,599.9 L 812.3,598.8 L 811,598.8 L 808.7,599.1 L 805.8,600.4 L 799.9,602.2 L 796.1,604.1 L 793.8,604.5 L 793.4,602.9 L 794.9,602.1 L 793.6,599.9 L 794.9,598.1 L 796.7,595.9 L 795.8,595.4 L 793.6,595.7 L 791.2,596.7 L 789.3,596.7 L 788,598.5 L 786.6,599.9 L 782.8,601 L 781.9,601.9 L 774,605.4 L 774.6,603.3 L 773.8,602.2 L 772.3,601.7 L 773.4,600.7 L 772.6,600.1 L 768.9,599.6 L 767.5,597.9 L 768.6,596.4 L 768.4,595.7 L 767.4,595.2 L 767.1,595.1 L 767,594.5 L 766.7,593.7 L 766.7,593.7 L 765.9,593.5 L 762.8,594.4 L 762,594.6 L 761.2,595.1 L 761.1,596.4 L 762.9,598.9 L 763.7,599.3 L 764.7,600.1 L 764,601 L 764.6,604.1 L 767.5,604.3 L 768.2,604.9 L 770.3,606.2 L 771.4,606.6 L 772.7,608.7 L 779.2,613.2 L 780.6,614.6 L 776,616.7 L 772.7,618.5 L 769.8,619.5 L 767.7,620.7 L 765.4,621.8 L 759.9,623.3 L 758.3,622.4 L 757.4,622.3 L 757.4,618.3 L 756.1,617.7 L 753.1,617.4 L 752.6,617.6 L 752,617.9 L 751,619.6 L 750.6,621 L 750.6,621.1 L 750.6,622.1 L 750.7,622.4 L 750.7,622.5 L 750.8,623.2 L 750.9,624.5 L 749.7,626.2 L 749.7,627.3 L 751.2,629.4 L 750.2,631.8 L 747,634.1 L 742.7,637.2 L 739.9,639.4 L 734.9,638.4 L 732.8,639.4 L 733.2,640.7 L 732.5,641.7 L 732.2,643.2 L 733,645.7 L 731.8,646.7 L 730.2,649.2 L 725.7,654.7 L 724.6,656.3 L 724.5,656.6 L 723.1,658 L 720.8,661.8 L 720.7,662.2 L 720.5,662.3 L 720.2,662.4 L 719,662.5 L 718.8,662.4 L 718.1,662.3 L 717.9,662.2 L 717.7,662.1 L 717.7,662.1 L 717.6,661.8 L 717.6,661.6 L 717.6,661.2 L 717,660.4 L 716.5,659.6 L 716.4,659.2 L 715.4,658.2 L 714.9,658 L 714,657.9 L 713.1,658.1 L 711.9,658.3 L 710.1,659 L 707.9,660.4 L 707.4,660.3 L 706,661.3 L 704.9,665.4 L 706.8,668.6 L 710.8,670.8 L 715.1,673.3 L 712.3,678.3 L 712.2,679.5 L 711.9,680.5 L 710.1,682.4 L 708.7,685.7 L 708.2,688.7 L 707,690.8 L 706.7,693.7 L 706,695.4 L 704.3,699.6 L 703.4,700.7 L 702.1,701.3 L 698.1,702.5 L 694.3,703.9 L 693.2,703 L 694.7,702.9 L 695.4,701.9 L 696.9,701.7 L 696.8,700.2 L 698,698.4 L 696.6,697.2 L 695.2,698.3 L 691.4,701.1 L 688.4,703.4 L 686.7,703.4 L 686.3,703.7 L 686.2,705.9 L 686.9,706.7 L 690.5,706.9 L 692.1,707.4 L 695.2,707.6 L 696.5,706.9 L 697.9,706.1 L 699.9,705.4 L 702.6,705.1 L 701.8,709.8 L 701.1,716.3 L 700.1,716.8 L 699.7,717.9 L 698.3,717.4 L 697.1,718 L 698.5,720.2 L 698.1,720.5 L 697.7,721.1 L 698.5,722.7 L 698.8,723.5 L 698.3,725.4 L 694,725.2 L 692.5,726 L 693,727.9 L 692.5,729.2 L 693.7,732.4 L 693.1,733.2 L 692.8,735.3 L 691.9,737.3 L 693.1,738.6 L 696,740.2 L 698.4,743.7 L 699.2,745 L 701,753.2 L 701.3,755.8 L 703.1,759.3 L 702.4,762.1 L 702.1,763.8 L 702.2,765.1 L 701.2,765.9 L 701.5,767.2 L 702.8,767.4 L 703.5,767.4 L 702.7,769.7 L 703.9,770.3 L 704.8,769.9 L 705.7,770.1 L 706.7,771.4 L 705.2,773.6 L 705.1,776.2 L 706.2,775.9 L 706.7,774.9 L 708.7,774.1 L 709.7,774.8 L 708,777.2 L 708.5,777.8 L 708.7,781.1 L 709.6,781.3 L 711.1,780.7 L 711.4,782.5 L 710.4,784.1 L 712.3,786.2 L 712.3,787.6 L 712.3,790.7 L 713.4,792.4 L 712.5,792.8 L 713.6,794.5 L 716.1,795.4 L 719.7,795.7 L 719.3,799.2 L 717.8,799.5 L 718.2,801.8 L 719,802.2 L 721.6,801.5 L 722.5,800.4 L 721.8,798.1 L 721,797.5 L 723.3,796.8 L 723.3,800.2 L 721.8,804.4 L 714.2,805.2 L 707.3,808 L 706.9,810.3 L 697,810.7 L 690.5,806.3 L 683.7,799 L 667.1,796.6 L 657.7,797.2 L 648.5,797.2 L 638.4,795 L 625.1,785.4 L 613.9,781.9 L 611,781.7 L 604.7,780.4 L 597,773.3 L 592.9,773.6 L 574.2,768.1 L 569.1,758 L 563.8,741.4 L 557.7,732.3 L 548.2,723.5 L 547.8,720.1 L 549.5,718 L 548.6,706.1 L 547.6,705 L 546.3,704.9 L 541.8,701.8 L 541.2,701.1 L 544.6,695.4 L 545.6,688.1 L 540.9,679 L 534.7,676 L 534.4,676.5 L 517.9,666.1 L 513.5,659.2 L 513.9,656.2 L 506.6,649.3 L 499.8,638.4 L 499.2,637.6 L 492.9,635.4 L 489.9,633.8 L 483.7,627.9 L 480.5,610.8 L 476.4,609.6 L 473.1,603.3 L 467.7,598.3 L 466.8,595 L 467.2,592.3 L 464.2,585.9 L 457.1,579 L 456.5,573.8 L 455.2,567 L 454.4,564.9 L 445,553.7 L 429.9,544.8 L 426.3,539.7 L 422.9,536.7 L 411.6,532.5 L 410.5,524.9 L 403.4,522 L 394.9,513.7 L 381.1,514.6 L 371.4,513.2 L 362.1,511.8 L 350.2,512.2 L 344.4,512 L 331.7,506.6 L 328.8,505.7 L 325.4,508.1 L 322.4,514.1 L 316.1,512.5 L 310.9,515.4 L 302.5,516.3 L 300,519.4 L 293.6,531.1 L 289.8,539.1 L 286.4,545.5 L 285.6,553.8 L 286.7,554.1 L 286.2,556.2 L 277.3,560.2 L 268.1,573.7 L 264.4,574.7 L 247.7,570.7 L 241,566 L 236.8,562 L 230.4,559.9 L 222.4,558.5 L 216.5,552.5 L 212.9,551.3 L 203.4,549.8 L 189.6,543.3 L 184.3,537.3 L 180.4,533.3 L 176,532.2 L 161.2,523.6 L 158.6,517.9 L 157.4,513.7 L 149.7,503 L 148.7,502.2 L 148.2,489.1 L 146.5,478.2 L 141,472.2 L 134,458 L 126.4,449.6 L 120.9,444 L 108.1,435.2 L 104,434.9 L 92.8,428 L 80.2,418.4 L 79.6,415.5 L 74.7,411 L 67,407.3 L 57.9,397.8 L 53.8,396 L 48.1,390.4 L 40.3,388.2 L 32.4,384.4 L 32.1,384.2 L 31.7,383.7 L 28.5,378.1 L 18.8,364 L 14.6,362.1 L 7.6,360 L 7.6,359.8 L 7.6,359.6 L 7.4,359.4 L 7.2,359.4 L 7.1,359.1 L 7.1,359 L 6.5,358.6 L 6.3,358.5 L 4.9,357.8 L 1.7,355.3 L 1,355.3 L 0.2,354.5 L 0.9,347.5 L 2.2,343.5 L 2.5,343.5 L 4.7,343.5 L 16.5,343.4 L 19.1,343.4 L 32.2,343.4 L 34,343.4 L 48.1,343.4 L 56.6,343.4 L 91.5,343.5 L 94.5,343.5 L 112.8,343.5 L 114.1,343.5 L 115.2,343.5 L 118.4,343.5 L 135.9,343.5 L 151.7,343.5 L 160,343.5 L 202.1,343.5 L 252,343.5 L 256.3,343.5 L 256.5,343.5 L 270.2,343.5 L 272,343.5 L 272,334.1 L 272,303.7 L 272,297.7 L 272,295.9 L 272,291.4 L 272,289.4 L 272,284.2 L 272,283.6 L 272,280.3 L 272,278.1 L 272,277.3 L 272,274.8 L 272,269.9 L 272,266.4 L 272.1,264 L 272.5,243.1 L 272.6,237.6 L 272.9,223.6 L 273,218.2 L 273,217 L 273.1,213.6 L 273.3,204.3 L 273.4,198.4 L 273.5,195 L 273.6,190.6 L 273.6,188.4 L 273.6,187.7 L 273.6,187.5 L 273.6,186.1 L 273.6,184.2 L 273.6,168.8 L 273.6,167 L 273.6,161.9 L 273.6,161.8 L 273.6,161.5 L 273.6,161.2 L 273.6,160.8 L 273.6,160.3 L 273.6,156.1 L 273.6,155.8 L 273.6,143.6 L 273.7,133.8 L 273.7,126 L 273.7,118 L 273.7,103.6 L 273.7,102.4 L 273.7,100.6 L 273.7,100.6 L 273.7,98.4 L 273.8,58.1 L 273.7,14 L 273.7,1.7 L 340.9,0 L 366.5,0.1 L 369.4,0.1 L 369.9,0.1 L 370.1,0.1 L 376.3,0.1 L 380,0.1 L 423.1,0.1 L 426.1,0.1 L 433.1,0.1 L 435.8,0.1 L 438.4,0.1 L 441,0.1 L 443,0.1 L 444.4,0.1 L 444.6,0.1 L 447.8,0.1 L 450.6,0.1 L 451.8,0.1 L 455.7,0.1 L 456.4,0.1 L 460.7,0.1 L 461.4,0.1 L 461.8,0.1 L 464.2,0.1 L 465.4,0.1 L 465.5,0.1 L 472.3,0.1 L 472.8,0.1 L 473.8,0.1 L 474.4,0.1 L 477,0.1 L 479.1,0.1 L 480.4,0.1 L 482.2,0.1 L 482.2,0.1 L 499.1,0.1 L 505.9,0.1 L 505.9,47.3 L 505.9,82.3 L 505.9,112.2 L 505.9,133.9 Z`;
  // More accurate neighboring states that match Texas boundaries
  const neighboringStates = {
    // Oklahoma (north border - above the panhandle and northeastern part)
    oklahoma: `
      M 92,70 L 115,70 L 140,70 L 165,70 L 190,70 L 215,70 L 215,50
      L 240,50 L 265,50 L 290,50 L 315,50 L 340,50 L 365,50 L 390,50
      L 415,50 L 440,50 L 465,50 L 490,50 L 515,50
      L 515,20 L 215,20 L 215,35 L 92,35
      Z
    `,
    // New Mexico (western border - straight line)
    newMexico: `
      M 40,70 L 92,70 L 92,95 L 92,120 L 92,145 L 92,170 L 92,195
      L 92,220 L 92,245 L 92,220 L 92,195 L 92,170 L 92,145 L 92,120
      L 92,95 L 92,70 L 92,95 L 92,120 L 92,145 L 92,170 L 92,195
      L 92,220 L 92,245 L 92,270 L 92,295 L 92,320 L 92,345 L 92,370
      L 92,395 L 92,420 L 92,445 L 92,470
      L 40,470 L 40,70
      Z
    `,
    // Louisiana (eastern border - irregular, following Sabine River)
    louisiana: `
      M 515,50 L 558,50 L 558,65 L 558,80 L 558,95 L 558,110 L 558,125
      L 558,140 L 558,155 L 558,170 L 558,185 L 558,200 L 558,215
      L 558,230 L 558,245 L 557,260 L 556,275 L 554,290 L 551,305
      L 547,320 L 542,335 L 537,350 L 531,365 L 524,380 L 516,395
      L 507,408 L 497,420 L 485,431 L 472,441
      L 485,455 L 500,465 L 515,472 L 530,477
      L 530,50 L 558,50 L 558,477
      Z
    `,
    // Arkansas (northeastern border above Louisiana)
    arkansas: `
      M 515,50 L 540,50 L 565,50 L 565,20 L 515,20
      L 515,65 L 515,80 L 515,95 L 520,110 L 527,125 L 535,140
      L 542,155 L 548,170 L 552,185 L 555,200 L 557,215 L 558,230
      L 570,230 L 570,50 L 565,50
      Z
    `,
    // Mexico (southern border - following Rio Grande curve)
    mexico: `
      M 92,470 L 92,495 L 103,505 L 116,512 L 131,517 L 148,520
      L 166,521 L 185,520 L 205,518 L 226,515 L 248,511 L 271,506
      L 295,500 L 319,493 L 344,485 L 369,476 L 394,466 L 419,455
      L 443,443 L 466,430 L 485,416 L 500,401
      L 485,431 L 472,441 L 458,449 L 443,456 L 427,462 L 410,467
      L 392,471 L 374,474 L 355,476 L 336,477 L 317,477 L 298,476
      L 280,474 L 262,471 L 245,467 L 229,462 L 214,456 L 200,449
      L 188,441 L 177,431 L 168,420 L 160,408 L 154,395 L 149,380
      L 145,365 L 142,350 L 140,335 L 138,320 L 137,305 L 136,290
      L 135,275 L 134,260 L 133,245 L 132,230 L 131,215 L 130,200
      L 128,185 L 125,170 L 121,155 L 116,140 L 110,125 L 103,110
      L 95,95 L 92,80 L 92,95 L 92,120 L 92,145 L 92,170 L 92,195
      L 92,220 L 92,245 L 92,270 L 92,295 L 92,320 L 92,345 L 92,370
      L 92,395 L 92,420 L 92,445
      Z
    `
  };

  // Function to convert lat/lng to SVG coordinates with better accuracy
  const latLngToXY = (coordinates: [number, number]): { x: number; y: number } => {
    const [lng, lat] = coordinates;

    // Accurate Texas bounds from GeoJSON conversion (matches actual state boundaries)
    const minLng = -106.627808, maxLng = -93.527644;
    const minLat = 25.856459, maxLat = 36.500397;

    // SVG dimensions: viewBox 0 0 1000 812.5
    const svgWidth = 1000;
    const svgHeight = 812.5;

    // Map geographic coordinates to SVG coordinates
    const x = ((lng - minLng) / (maxLng - minLng)) * svgWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * svgHeight;

    return { x, y };
  };

  // Get marker size based on exposure
  const getMarkerSize = (exposure: number): number => {
    const maxExposure = Math.max(...data.map(d => d.exposureM));
    const minSize = 8;
    const maxSize = 20;
    return minSize + ((exposure / maxExposure) * (maxSize - minSize));
  };

  // Handle mouse enter on marker
  const handleMouseEnter = (cityData: GeoMapDataPoint, event: React.MouseEvent) => {
    setHoveredCity(cityData);
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: event.clientX - rect.left + 10,
      y: event.clientY - rect.top - 10
    });
  };

  // Handle mouse move for tooltip tracking
  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredCity) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltipPos({
        x: event.clientX - rect.left + 10,
        y: event.clientY - rect.top - 10
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCity(null);
  };

  const handleMarkerClick = (city: string) => {
    if (onCityClick) {
      onCityClick(city);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-white border border-gray-200 rounded-lg shadow-sm p-3">
        <div className="text-sm font-semibold text-gray-700 mb-2">Risk Level</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors.critical }}
            />
            <span className="text-xs text-gray-600">Critical (3 cities)</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors.medium }}
            />
            <span className="text-xs text-gray-600">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors.low }}
            />
            <span className="text-xs text-gray-600">Low Risk</span>
          </div>
        </div>
      </div>

      {/* SVG Map */}
      <svg
        viewBox="0 0 1000 812.5"
        className="w-full h-full"
        style={{ minHeight: '500px' }}
        onMouseMove={handleMouseMove}
      >
        <defs>
          {/* Gradient for heatmap overlay */}
          <radialGradient id="westTexasHeat" cx="30%" cy="50%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id="eastTexasHeat" cx="70%" cy="40%">
            <stop offset="0%" stopColor="#dc2626" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </radialGradient>
        </defs>

        {/* Texas View */}
        <g>
            {/* Neighboring states (background) */}
            <path
              d={neighboringStates.oklahoma}
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="1"
              opacity="0.5"
            />
            <text x="350" y="35" fontSize="10" fill="#9ca3af" textAnchor="middle" fontWeight="500">
              OKLAHOMA
            </text>

            <path
              d={neighboringStates.newMexico}
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="1"
              opacity="0.5"
            />
            <text x="65" y="270" fontSize="10" fill="#9ca3af" textAnchor="middle" fontWeight="500" transform="rotate(-90 65 270)">
              NEW MEXICO
            </text>

            <path
              d={neighboringStates.louisiana}
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="1"
              opacity="0.5"
            />
            <text x="544" y="320" fontSize="10" fill="#9ca3af" textAnchor="middle" fontWeight="500">
              LA
            </text>

            <path
              d={neighboringStates.arkansas}
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="1"
              opacity="0.5"
            />
            <text x="543" y="135" fontSize="10" fill="#9ca3af" textAnchor="middle" fontWeight="500">
              ARK
            </text>

            <path
              d={neighboringStates.mexico}
              fill="#f9fafb"
              stroke="#d1d5db"
              strokeWidth="1"
              opacity="0.4"
            />
            <text x="295" y="505" fontSize="10" fill="#9ca3af" textAnchor="middle" fontWeight="500">
              MEXICO
            </text>

            {/* Texas base */}
            <path
              d={texasPath}
              fill="#fefce8"
              stroke="#84cc16"
              strokeWidth="2.5"
            />

            {/* Heatmap overlay - West Texas hot zone */}
            <path
              d={texasPath}
              fill="url(#westTexasHeat)"
              opacity="0.7"
            />

            {/* Heatmap overlay - East Texas medium zone */}
            <path
              d={texasPath}
              fill="url(#eastTexasHeat)"
              opacity="0.5"
            />

            {/* City markers */}
            {data.map((cityData, index) => {
              const pos = latLngToXY(cityData.coordinates);
              const size = getMarkerSize(cityData.exposureM);
              const color = colors[cityData.riskLevel];

              return (
                <g key={index}>
                  {/* Outer glow for critical cities */}
                  {cityData.riskLevel === 'critical' && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={size + 4}
                      fill={color}
                      opacity="0.2"
                    />
                  )}

                  {/* Main marker */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size}
                    fill={color}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    onMouseEnter={(e) => handleMouseEnter(cityData, e)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleMarkerClick(cityData.city)}
                  />

                  {/* City label - all cities */}
                  <text
                    x={pos.x}
                    y={pos.y - size - 5}
                    textAnchor="middle"
                    fontSize={cityData.riskLevel === 'critical' ? "11" : "9"}
                    fontWeight={cityData.riskLevel === 'critical' ? "600" : "500"}
                    fill={cityData.riskLevel === 'critical' ? "#1f2937" : "#6b7280"}
                    className="pointer-events-none"
                  >
                    {cityData.city}
                  </text>
                </g>
              );
            })}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredCity && (
        <div
          className="absolute bg-white border border-gray-300 rounded-lg shadow-lg p-3 pointer-events-none z-20"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            minWidth: '220px'
          }}
        >
          <div className="font-semibold text-gray-900 mb-2">
            {hoveredCity.city} - {hoveredCity.zipCode}
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Utilization Velocity:</span>
              <span className="font-medium text-gray-900">
                {hoveredCity.utilizationVelocity.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Exposure:</span>
              <span className="font-medium text-gray-900">
                ${hoveredCity.exposureM}M
              </span>
            </div>
            <div className="flex justify-between">
              <span>Avg CLTV:</span>
              <span className="font-medium text-gray-900">
                {hoveredCity.avgCLTV.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>HPI Change:</span>
              <span className={`font-medium ${hoveredCity.hpiChange < 0 ? 'text-red-600' : 'text-green-600'}`}>
                {hoveredCity.hpiChange > 0 ? '+' : ''}{hoveredCity.hpiChange.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Prime Borrowers:</span>
              <span className="font-medium text-gray-900">
                {hoveredCity.primeCount}
              </span>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200">
            <div className={`text-xs font-semibold uppercase ${
              hoveredCity.riskLevel === 'critical' ? 'text-red-600' :
              hoveredCity.riskLevel === 'medium' ? 'text-orange-600' :
              'text-green-600'
            }`}>
              {hoveredCity.riskLevel} Risk
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoMap;
